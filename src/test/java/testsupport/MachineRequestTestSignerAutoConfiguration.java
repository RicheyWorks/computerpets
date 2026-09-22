package testsupport;

import com.enterprisepet.config.MachineRequestSignatureFilter;
import com.enterprisepet.security.MachineRequestSignature;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.web.client.RestTemplateCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpRequest;

import java.time.Instant;

/**
 * Signs {@code POST /api/verify/**} from {@link org.springframework.boot.test.web.client.TestRestTemplate}
 * with {@code license.secret-key}. Production clients sign themselves.
 * Not on the main component scan.
 */
@AutoConfiguration
public class MachineRequestTestSignerAutoConfiguration {

    @Bean
    RestTemplateCustomizer machineRequestTestSigner(Environment environment) {
        return restTemplate -> restTemplate.getInterceptors().add((request, body, execution) -> {
            if (needsSignature(request)) {
                String key = environment.getProperty("license.secret-key");
                byte[] bytes = body == null ? new byte[0] : body;
                String path = request.getURI().getRawPath();
                String query = request.getURI().getRawQuery();
                String ts = Long.toString(Instant.now().getEpochSecond());
                String sig = MachineRequestSignature.sign(key, request.getMethod().name(), path, query, ts, bytes);
                request.getHeaders().set(MachineRequestSignature.TIMESTAMP_HEADER, ts);
                request.getHeaders().set(MachineRequestSignature.SIGNATURE_HEADER, sig);
            }
            return execution.execute(request, body);
        });
    }

    private static boolean needsSignature(HttpRequest request) {
        if (request.getMethod() == null || request.getURI() == null) {
            return false;
        }
        String path = request.getURI().getRawPath();
        return MachineRequestSignatureFilter.requiresSignature(request.getMethod().name(), path);
    }
}
