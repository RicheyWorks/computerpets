package com.enterprisepet.config;

import io.swagger.v3.oas.models.examples.Example;

/**
 * Centralized location for all OpenAPI request/response examples.
 * Returns reusable {@link Example} model objects that can be registered in OpenAPI Components.
 */
public final class ApiExamples {

    private ApiExamples() {
        // Utility class
    }

    // ==================== REQUEST EXAMPLES ====================

    public static final String VERIFY_STEAM_REQUEST = """
        {
          "steamId": "76561198000000000",
          "appId": "123456",
          "petType": "red_panda"
        }
        """;

    public static final String VERIFY_NFT_REQUEST = """
        {
          "walletAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          "contractAddress": "0x1234567890123456789012345678901234567890",
          "tokenId": "12345",
          "petType": "red_panda"
        }
        """;

    public static final String VERIFY_MICROSOFT_REQUEST = """
        {
          "xstsToken": "eyJhbGciOiJIUzI1NiIs...",
          "userHash": "123456789012345",
          "storeProductId": "9N1234567890",
          "petType": "red_panda"
        }
        """;

    public static final String DOWNLOAD_REQUEST = """
        {
          "ciphertext": "base64ciphertext...",
          "iv": "base64iv..."
        }
        """;

    // ==================== RESPONSE EXAMPLES ====================

    public static final String VERIFY_SUCCESS_RESPONSE = """
        {
          "status": "success",
          "provider": "steam",
          "license": {
            "ciphertext": "base64ciphertext...",
            "iv": "base64iv...",
            "expiresAt": "2027-05-23T12:00:00Z"
          },
          "auth": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "tokenType": "Bearer",
            "expiresInSeconds": 1800,
            "expiresAt": "2026-05-23T13:30:00Z"
          },
          "pet": {
            "key": "red_panda",
            "displayName": "Red Panda"
          },
          "message": "Steam ownership verified. License issued."
        }
        """;

    public static final String VERIFY_ERROR_RESPONSE = """
        {
          "error": "Steam ownership not found",
          "provider": "steam"
        }
        """;

    public static final String DOWNLOAD_SUCCESS_RESPONSE = """
        {
          "petKey": "red_panda",
          "displayName": "Red Panda",
          "rarity": "COMMON",
          "downloadUrl": "https://cdn.example.com/bundles/red_panda.zip?owner=...&exp=...&sig=...",
          "expiresAt": "2026-05-23T12:15:00Z",
          "ttlSeconds": 900
        }
        """;

    // ==================== DOWNLOAD ERROR EXAMPLES (varied formats) ====================

    public static final String DOWNLOAD_LICENSE_INVALID_ERROR = """
        {
          "error": "license missing, expired, or tampered"
        }
        """;

    public static final String DOWNLOAD_PET_MISMATCH_ERROR = """
        {
          "error": "license is not valid for the requested pet",
          "requested": "dragon",
          "licensedFor": "red_panda"
        }
        """;

    public static final String DOWNLOAD_AUTH_MISMATCH_ERROR = """
        {
          "error": "auth token does not match license",
          "tokenSubject": "76561198000000000",
          "tokenPet": "red_panda",
          "licenseOwner": "76561198000000000",
          "licensePet": "cat"
        }
        """;

    public static final String UNKNOWN_PET_TYPE_ERROR = """
        {
          "error": "unknown petType",
          "received": "unicorn",
          "validKeys": "red_panda, cat, dog, rabbit, ..., phoenix"
        }
        """;

    // ==================== ADDITIONAL RFC 7807 / GLOBAL ERROR VARIANTS ====================

    public static final String MALFORMED_REQUEST_ERROR = """
        {
          "type": "about:blank",
          "title": "Malformed request",
          "status": 400,
          "detail": "Request body is missing or not valid JSON"
        }
        """;

    public static final String MISSING_PARAMETER_ERROR = """
        {
          "type": "about:blank",
          "title": "Missing parameter",
          "status": 400,
          "detail": "Missing required parameter 'rarity'",
          "parameter": "rarity"
        }
        """;

    public static final String INTERNAL_SERVER_ERROR = """
        {
          "type": "about:blank",
          "title": "Internal server error",
          "status": 500,
          "detail": "An unexpected error occurred. Try again later."
        }
        """;

    // ==================== Example Model Objects (for Components) ====================

    public static Example steamVerificationRequest() {
        return new Example()
                .summary("Verify ownership via Steam")
                .description("Example request body for verifying Steam game ownership")
                .value(VERIFY_STEAM_REQUEST);
    }

    public static Example nftVerificationRequest() {
        return new Example()
                .summary("Verify ownership via Ethereum NFT")
                .description("Example request body for verifying NFT ownership on-chain")
                .value(VERIFY_NFT_REQUEST);
    }

    public static Example microsoftVerificationRequest() {
        return new Example()
                .summary("Verify ownership via Microsoft Store")
                .description("Example request body for verifying Microsoft Store entitlement")
                .value(VERIFY_MICROSOFT_REQUEST);
    }

    public static Example verifySuccessResponse() {
        return new Example()
                .summary("Successful ownership verification")
                .description("Response returned when ownership is successfully verified and a license is issued")
                .value(VERIFY_SUCCESS_RESPONSE);
    }

    public static Example verifyErrorResponse() {
        return new Example()
                .summary("Ownership verification failed")
                .description("Returned when the provider cannot confirm ownership")
                .value(VERIFY_ERROR_RESPONSE);
    }

    public static Example downloadSuccessResponse() {
        return new Example()
                .summary("Signed download URL")
                .description("Response containing a short-lived signed CDN URL for the pet bundle")
                .value(DOWNLOAD_SUCCESS_RESPONSE);
    }

    // ==================== PET CATALOG EXAMPLES ====================

    public static final String PETS_LIST_RESPONSE = """
        [
          { "key": "red_panda",   "displayName": "Red Panda",   "rarity": "COMMON" },
          { "key": "cat",         "displayName": "Cat",         "rarity": "COMMON" },
          { "key": "dog",         "displayName": "Dog",         "rarity": "COMMON" },
          { "key": "rabbit",      "displayName": "Rabbit",      "rarity": "COMMON" },
          { "key": "hamster",     "displayName": "Hamster",     "rarity": "COMMON" },
          { "key": "guinea_pig",  "displayName": "Guinea Pig",  "rarity": "COMMON" },
          { "key": "turtle",      "displayName": "Turtle",      "rarity": "COMMON" },
          { "key": "goldfish",    "displayName": "Goldfish",    "rarity": "COMMON" },
          { "key": "budgie",      "displayName": "Budgie",      "rarity": "COMMON" },
          { "key": "fox",         "displayName": "Fox",         "rarity": "UNCOMMON" },
          { "key": "penguin",     "displayName": "Penguin",     "rarity": "UNCOMMON" },
          { "key": "parrot",      "displayName": "Parrot",      "rarity": "UNCOMMON" },
          { "key": "ferret",      "displayName": "Ferret",      "rarity": "UNCOMMON" },
          { "key": "hedgehog",    "displayName": "Hedgehog",    "rarity": "UNCOMMON" },
          { "key": "chinchilla",  "displayName": "Chinchilla",  "rarity": "UNCOMMON" },
          { "key": "axolotl",     "displayName": "Axolotl",     "rarity": "RARE" },
          { "key": "toucan",      "displayName": "Toucan",      "rarity": "RARE" },
          { "key": "iguana",      "displayName": "Iguana",      "rarity": "RARE" },
          { "key": "dragon",      "displayName": "Dragon",      "rarity": "LEGENDARY" },
          { "key": "phoenix",     "displayName": "Phoenix",     "rarity": "LEGENDARY" }
        ]
        """;

    public static final String PETS_BY_RARITY_RESPONSE = """
        [
          { "key": "axolotl", "displayName": "Axolotl", "rarity": "RARE" },
          { "key": "toucan",  "displayName": "Toucan",  "rarity": "RARE" }
        ]
        """;

    public static final String PETS_GROUPED_BY_RARITY_RESPONSE = """
        {
          "COMMON": [
            { "key": "red_panda", "displayName": "Red Panda", "rarity": "COMMON" },
            { "key": "cat",       "displayName": "Cat",       "rarity": "COMMON" }
          ],
          "UNCOMMON": [
            { "key": "fox", "displayName": "Fox", "rarity": "UNCOMMON" }
          ],
          "RARE": [
            { "key": "axolotl", "displayName": "Axolotl", "rarity": "RARE" }
          ],
          "LEGENDARY": [
            { "key": "dragon",  "displayName": "Dragon",  "rarity": "LEGENDARY" },
            { "key": "phoenix", "displayName": "Phoenix", "rarity": "LEGENDARY" }
          ]
        }
        """;

    public static final String PET_DETAIL_RESPONSE = """
        {
          "key": "red_panda",
          "displayName": "Red Panda",
          "rarity": "COMMON"
        }
        """;

    public static final String PET_NOT_FOUND_ERROR = """
        {
          "error": "unknown pet type",
          "key": "unicorn",
          "validKeys": "red_panda, cat, dog, rabbit, ..., phoenix"
        }
        """;

    public static final String VALIDATION_ERROR_RESPONSE = """
        {
          "type": "about:blank",
          "title": "Validation error",
          "status": 400,
          "detail": "Request validation failed",
          "fieldErrors": {
            "steamId": "must not be blank",
            "appId": "must not be blank"
          }
        }
        """;

    public static final String RATE_LIMITED_RESPONSE = """
        {
          "type": "about:blank",
          "title": "Too Many Requests",
          "status": 429,
          "detail": "Rate limit exceeded for verify. Retry after 45 seconds.",
          "retryAfterSeconds": 45
        }
        """;

    public static final String PROVIDERS_LIST_RESPONSE = """
        [
          { "key": "steam", "displayName": "Steam" },
          { "key": "nft", "displayName": "Ethereum NFT" },
          { "key": "microsoft", "displayName": "Microsoft Store" }
        ]
        """;

    public static final String UNKNOWN_PROVIDER_ERROR = """
        {
          "error": "unknown provider",
          "provider": "epic",
          "validProviders": "steam, nft, microsoft"
        }
        """;

    public static final String PROVIDER_CALL_FAILED_ERROR = """
        {
          "error": "provider call failed",
          "provider": "steam",
          "detail": "Connection refused"
        }
        """;

    // ==================== Additional Example Factory Methods ====================

    public static Example petsListResponse() {
        return new Example()
                .summary("Full pet catalog")
                .description("Returns all available pets with their rarity")
                .value(PETS_LIST_RESPONSE);
    }

    public static Example petsByRarityResponse() {
        return new Example()
                .summary("Filtered by rarity")
                .description("Returns only pets of the requested rarity")
                .value(PETS_BY_RARITY_RESPONSE);
    }

    public static Example petDetailResponse() {
        return new Example()
                .summary("Single pet details")
                .description("Returns information about one specific pet type")
                .value(PET_DETAIL_RESPONSE);
    }

    public static Example petNotFoundError() {
        return new Example()
                .summary("Pet not found")
                .description("Returned when requesting a pet that does not exist")
                .value(PET_NOT_FOUND_ERROR);
    }

    public static Example validationErrorResponse() {
        return new Example()
                .summary("Request validation failed")
                .description("RFC 7807 Problem Detail for 400 Bad Request")
                .value(VALIDATION_ERROR_RESPONSE);
    }

    public static Example rateLimitedResponse() {
        return new Example()
                .summary("Rate limit exceeded")
                .description("RFC 7807 Problem Detail for 429 Too Many Requests")
                .value(RATE_LIMITED_RESPONSE);
    }

    public static Example providersListResponse() {
        return new Example()
                .summary("List of available providers")
                .description("Response from GET /api/verify/providers")
                .value(PROVIDERS_LIST_RESPONSE);
    }

    public static Example petsGroupedByRarityResponse() {
        return new Example()
                .summary("Pets grouped by rarity")
                .description("Response from GET /api/pets/by-rarity")
                .value(PETS_GROUPED_BY_RARITY_RESPONSE);
    }

    public static Example unknownProviderError() {
        return new Example()
                .summary("Unknown provider")
                .description("Returned when calling /api/verify with an unregistered provider")
                .value(UNKNOWN_PROVIDER_ERROR);
    }

    public static Example providerCallFailedError() {
        return new Example()
                .summary("Provider call failed")
                .description("Returned when an external provider (Steam, Microsoft, Web3, etc.) cannot be reached")
                .value(PROVIDER_CALL_FAILED_ERROR);
    }

    // ==================== Download examples ====================

    public static Example downloadRequest() {
        return new Example()
                .summary("Download request (encrypted license)")
                .description("POST body for /api/download/{petKey} — the encrypted license fields received from /api/verify")
                .value(DOWNLOAD_REQUEST);
    }

    public static Example downloadLicenseInvalidError() {
        return new Example()
                .summary("License invalid or expired")
                .description("Returned by /api/download when the encrypted license cannot be decrypted/validated")
                .value(DOWNLOAD_LICENSE_INVALID_ERROR);
    }

    public static Example downloadPetMismatchError() {
        return new Example()
                .summary("License/pet mismatch")
                .description("Returned when the license was issued for a different pet than requested")
                .value(DOWNLOAD_PET_MISMATCH_ERROR);
    }

    public static Example downloadAuthMismatchError() {
        return new Example()
                .summary("JWT does not match license")
                .description("Defense-in-depth failure: JWT principal disagrees with license owner/pet")
                .value(DOWNLOAD_AUTH_MISMATCH_ERROR);
    }

    public static Example unknownPetTypeError() {
        return new Example()
                .summary("Unknown petType in verification")
                .description("Returned by /api/verify when petType is not in the catalog")
                .value(UNKNOWN_PET_TYPE_ERROR);
    }

    // ==================== Additional error format variants ====================

    public static Example malformedRequestError() {
        return new Example()
                .summary("Malformed JSON request")
                .description("RFC 7807 Problem Detail for 400 when body is not valid JSON")
                .value(MALFORMED_REQUEST_ERROR);
    }

    public static Example missingParameterError() {
        return new Example()
                .summary("Missing required parameter")
                .description("RFC 7807 Problem Detail for 400 when a required query/param is absent")
                .value(MISSING_PARAMETER_ERROR);
    }

    public static Example internalServerError() {
        return new Example()
                .summary("Unexpected server error")
                .description("RFC 7807 Problem Detail for 500 Internal Server Error (generic catch-all)")
                .value(INTERNAL_SERVER_ERROR);
    }
}