package com.enterprisepet.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI computerPetsOpenAPI() {
        Server localServer = new Server()
                .url("http://localhost:" + serverPort)
                .description("Local Development Server");

        return new OpenAPI()
                .info(new Info()
                        .title("ComputerPets Backend API")
                        .description("Secure backend for premium desktop virtual pets. " +
                                "Handles ownership verification across Steam, Ethereum NFTs, and Microsoft Store, " +
                                "and issues encrypted licenses for asset downloads.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("ComputerPets Team")
                                .email("contact@computerpets.example"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(localServer))
                .components(new Components()
                        .addExamples("Steam Verification", ApiExamples.steamVerificationRequest())
                        .addExamples("NFT Verification", ApiExamples.nftVerificationRequest())
                        .addExamples("Microsoft Verification", ApiExamples.microsoftVerificationRequest())
                        .addExamples("Success Response", ApiExamples.verifySuccessResponse())
                        .addExamples("Ownership Denied", ApiExamples.verifyErrorResponse())
                        .addExamples("Download URL Response", ApiExamples.downloadSuccessResponse())
                        .addExamples("Pets List", ApiExamples.petsListResponse())
                        .addExamples("Pets By Rarity", ApiExamples.petsByRarityResponse())
                        .addExamples("Pet Detail", ApiExamples.petDetailResponse())
                        .addExamples("Pet Not Found", ApiExamples.petNotFoundError())
                        .addExamples("Validation Error", ApiExamples.validationErrorResponse())
                        .addExamples("Rate Limited", ApiExamples.rateLimitedResponse())
                        .addExamples("Providers List", ApiExamples.providersListResponse())
                        .addExamples("Pets Grouped By Rarity", ApiExamples.petsGroupedByRarityResponse())
                        .addExamples("Unknown Provider", ApiExamples.unknownProviderError())
                        .addExamples("Provider Call Failed", ApiExamples.providerCallFailedError())

                        // Download examples
                        .addExamples("Download Request", ApiExamples.downloadRequest())
                        .addExamples("Download License Invalid", ApiExamples.downloadLicenseInvalidError())
                        .addExamples("Download Pet Mismatch", ApiExamples.downloadPetMismatchError())
                        .addExamples("Download Auth Mismatch", ApiExamples.downloadAuthMismatchError())

                        // Additional error variants
                        .addExamples("Unknown Pet Type", ApiExamples.unknownPetTypeError())
                        .addExamples("Malformed Request", ApiExamples.malformedRequestError())
                        .addExamples("Missing Parameter", ApiExamples.missingParameterError())
                        .addExamples("Internal Server Error", ApiExamples.internalServerError())
                );
    }
}