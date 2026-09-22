package com.enterprisepet.bundle;

import io.lettuce.core.RedisClient;
import io.lettuce.core.ScriptOutputType;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

import java.time.Duration;

/**
 * Redis-backed one-time download grants shared by every app replica that points
 * at the same store as the rate limiter. Keys are
 * {@code download:grant:{jti}:{exp}}.
 *
 * <p>Value shape: {@code open|{ip}} until redeem, then {@code used|{ip}}.
 * The connection is opened on first use so a down Redis does not block process start.
 */
public class RedisDownloadGrantIndex implements DownloadGrantIndex, AutoCloseable {

    static final String KEY_PREFIX = "download:grant:";

    /** Atomic redeem: missing / used / ip / ok. Preserves TTL. */
    private static final String REDEEM_LUA = """
        local v = redis.call('GET', KEYS[1])
        if not v then
          return 'missing'
        end
        if string.sub(v, 1, 5) == 'used|' then
          return 'used'
        end
        if string.sub(v, 1, 5) ~= 'open|' then
          return 'missing'
        end
        local bound = string.sub(v, 6)
        local req = ARGV[1]
        if bound ~= '' and req ~= '' and bound ~= req then
          return 'ip'
        end
        local ttl = redis.call('PTTL', KEYS[1])
        redis.call('SET', KEYS[1], 'used|' .. bound)
        if ttl > 0 then
          redis.call('PEXPIRE', KEYS[1], ttl)
        end
        return 'ok'
        """;

    private final RedisClient redisClient;
    private final Object lock = new Object();
    private volatile StatefulRedisConnection<String, String> connection;
    private volatile String redeemSha;

    public RedisDownloadGrantIndex(RedisClient redisClient) {
        this.redisClient = redisClient;
    }

    @Override
    public void issue(String jti, long expEpochSeconds, String boundIp, Duration ttl) {
        if (jti == null || jti.isBlank() || expEpochSeconds <= 0) {
            return;
        }
        long seconds = ttlSeconds(ttl);
        String ip = boundIp == null ? "" : boundIp.trim();
        try {
            commands().setex(redisKey(jti, expEpochSeconds), seconds, "open|" + ip);
        } catch (DownloadGrantUnavailableException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new DownloadGrantUnavailableException("Redis download grant store unavailable", e);
        }
    }

    @Override
    public RedeemResult tryRedeem(String jti, long expEpochSeconds, String requestIp) {
        if (jti == null || jti.isBlank() || expEpochSeconds <= 0) {
            return RedeemResult.UNKNOWN;
        }
        String req = requestIp == null ? "" : requestIp.trim();
        try {
            String outcome = evalRedeem(redisKey(jti, expEpochSeconds), req);
            return switch (outcome == null ? "" : outcome) {
                case "ok" -> RedeemResult.OK;
                case "used" -> RedeemResult.ALREADY_USED;
                case "ip" -> RedeemResult.ADDRESS_MISMATCH;
                default -> RedeemResult.UNKNOWN;
            };
        } catch (DownloadGrantUnavailableException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new DownloadGrantUnavailableException("Redis download grant store unavailable", e);
        }
    }

    private String evalRedeem(String key, String requestIp) {
        RedisCommands<String, String> cmds = commands();
        if (redeemSha == null) {
            redeemSha = cmds.scriptLoad(REDEEM_LUA);
        }
        try {
            Object raw = cmds.evalsha(redeemSha, ScriptOutputType.VALUE, new String[]{key}, requestIp);
            return raw == null ? null : raw.toString();
        } catch (RuntimeException first) {
            // Script flushed (SCRIPT FLUSH) — reload once.
            redeemSha = cmds.scriptLoad(REDEEM_LUA);
            Object raw = cmds.evalsha(redeemSha, ScriptOutputType.VALUE, new String[]{key}, requestIp);
            return raw == null ? null : raw.toString();
        }
    }

    private RedisCommands<String, String> commands() {
        StatefulRedisConnection<String, String> existing = this.connection;
        if (existing != null && existing.isOpen()) {
            return existing.sync();
        }
        synchronized (lock) {
            if (connection == null || !connection.isOpen()) {
                try {
                    connection = redisClient.connect();
                } catch (RuntimeException e) {
                    throw new DownloadGrantUnavailableException("Redis download grant store unavailable", e);
                }
            }
            return connection.sync();
        }
    }

    static String redisKey(String jti, long expEpochSeconds) {
        return KEY_PREFIX + jti + ":" + expEpochSeconds;
    }

    static long ttlSeconds(Duration ttl) {
        if (ttl == null || ttl.isNegative() || ttl.isZero()) {
            return Duration.ofMinutes(15).toSeconds();
        }
        return Math.max(60L, ttl.toSeconds());
    }

    @Override
    public void close() {
        synchronized (lock) {
            if (connection != null && connection.isOpen()) {
                connection.close();
            }
            connection = null;
            redeemSha = null;
        }
    }
}
