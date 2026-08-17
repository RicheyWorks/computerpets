package com.enterprisepet.epic;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class EpicVerifyRequestTest {

    @Test
    @DisplayName("from(null) yields null fields")
    void from_nullMap_allNull() {
        EpicVerifyRequest request = EpicVerifyRequest.from(null);
        assertThat(request.accountId()).isNull();
        assertThat(request.sandboxId()).isNull();
        assertThat(request.catalogItemId()).isNull();
        assertThat(request.platform()).isNull();
    }

    @Test
    @DisplayName("blank strings become null")
    void from_blankStrings_becomeNull() {
        EpicVerifyRequest request = EpicVerifyRequest.from(Map.of(
                "accountId", "",
                "sandboxId", "  ",
                "catalogItemId", "\n",
                "platform", " "
        ));
        assertThat(request.accountId()).isNull();
        assertThat(request.sandboxId()).isNull();
        assertThat(request.catalogItemId()).isNull();
        assertThat(request.platform()).isNull();
    }

    @Test
    @DisplayName("documented keys round-trip onto getters")
    void from_documentedKeys_roundTrip() {
        EpicVerifyRequest request = EpicVerifyRequest.from(Map.of(
                "accountId", "  9626f441055349ce8cb7d7d5a483eaa2  ",
                "sandboxId", "fn",
                "catalogItemId", "4fe75bbc5a674f4f9b356b5c90567da5",
                "platform", "STEAM"
        ));
        assertThat(request.accountId()).isEqualTo("9626f441055349ce8cb7d7d5a483eaa2");
        assertThat(request.sandboxId()).isEqualTo("fn");
        assertThat(request.catalogItemId()).isEqualTo("4fe75bbc5a674f4f9b356b5c90567da5");
        assertThat(request.platform()).isEqualTo("STEAM");
    }
}
