package testsupport;

import com.enterprisepet.config.AdminRequestSignatureFilter;
import com.enterprisepet.security.AdminRequestSignature;
import com.enterprisepet.security.RequestNonce;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.web.client.RestTemplateCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpRequest;

import java.time.Instant;

/**
 * Signs {@code /api/admin/**} from {@link org.springframework.boot.test.web.client.TestRestTemplate}
 * with {@code admin.api-key}. Production operators and the house ledger sign
 * themselves. A caller that already set {@code X-ComputerPets-Signature} is
 * left alone so a test can send a bad MAC.
 * Not on the main component scan.
 */
@AutoConfiguration
public class AdminRequestTestSignerAutoConfiguration {

    @Bean
    RestTemplateCustomizer adminRequestTestSigner(Environment environment) {
        return restTemplate -> restTemplate.getInterceptors().add((request, body, execution) -> {
            if (needsSignature(request)
                    && !request.getHeaders().containsKey(AdminRequestSignature.SIGNATURE_HEADER)) {
                String key = environment.getProperty("admin.api-key");
                byte[] bytes = body == null ? new byte[0] : body;
                String path = request.getURI().getRawPath();
                String query = request.getURI().getRawQuery();
                String ts = Long.toString(Instant.now().getEpochSecond());
                String nonce = request.getHeaders().getFirst(RequestNonce.HEADER);
                if (nonce == null || nonce.isBlank()) {
                    nonce = RequestNonce.random();
                    request.getHeaders().set(RequestNonce.HEADER, nonce);
                }
                String sig = AdminRequestSignature.sign(
                        key, request.getMethod().name(), path, query, ts, nonce, bytes);
                request.getHeaders().set(AdminRequestSignature.TIMESTAMP_HEADER, ts);
                request.getHeaders().set(AdminRequestSignature.SIGNATURE_HEADER, sig);
            }
            return execution.execute(request, body);
        });
    }

    private static boolean needsSignature(HttpRequest request) {
        if (request.getMethod() == null || request.getURI() == null) {
            return false;
        }
        String path = request.getURI().getRawPath();
        return AdminRequestSignatureFilter.requiresSignature(request.getMethod().name(), path);
    }
}
