package com.enterprisepet.microsoft;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class MicrosoftStoreServiceTest {

    private MicrosoftStoreService service;

    @BeforeEach
    void setUp() {
        service = new MicrosoftStoreService();
    }

    @Test
    @DisplayName("responseContainsActiveProduct returns true for Active status")
    void responseContainsActiveProduct_activeStatus_returnsTrue() {
        String json = """
            {
              "Items": [
                { "ProductId": "9N1234567890", "Status": "Active" }
              ]
            }
            """;

        boolean result = service.responseContainsActiveProduct(json, "9N1234567890");
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("responseContainsActiveProduct returns true for ActiveSubscription")
    void responseContainsActiveProduct_activeSubscription_returnsTrue() {
        String json = """
            {
              "Items": [
                { "ProductId": "9N1234567890", "Status": "ActiveSubscription" }
              ]
            }
            """;

        boolean result = service.responseContainsActiveProduct(json, "9N1234567890");
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("responseContainsActiveProduct returns false for non-active status")
    void responseContainsActiveProduct_inactive_returnsFalse() {
        String json = """
            {
              "Items": [
                { "ProductId": "9N1234567890", "Status": "Suspended" }
              ]
            }
            """;

        boolean result = service.responseContainsActiveProduct(json, "9N1234567890");
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("responseContainsActiveProduct returns false when product not present")
    void responseContainsActiveProduct_productNotFound_returnsFalse() {
        String json = """
            {
              "Items": [
                { "ProductId": "9N9999999999", "Status": "Active" }
              ]
            }
            """;

        boolean result = service.responseContainsActiveProduct(json, "9N1234567890");
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("responseContainsActiveProduct handles camelCase and PascalCase keys")
    void responseContainsActiveProduct_mixedCase_returnsTrue() {
        String json = """
            {
              "Items": [
                { "productId": "9N1234567890", "status": "Active" }
              ]
            }
            """;

        boolean result = service.responseContainsActiveProduct(json, "9N1234567890");
        assertThat(result).isTrue();
    }
}