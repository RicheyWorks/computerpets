package com.enterprisepet.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * The X ads name {@code /pet/feed}, {@code /pet/play}, and {@code /pet/rest}.
 * Care already lives on the keeper machine. These routes answer that fact.
 * They do not feed, play, or rest anyone, and they do not return 200.
 */
@RestController
@Tag(name = "Care", description = "Advertised care paths. They refuse. Care stays on the keeper machine.")
public class CareDoorController {

    static final HttpStatus REFUSAL = HttpStatus.CONFLICT;

    @RequestMapping(
        path = {"/pet/feed", "/pet/play", "/pet/rest"},
        method = {
            RequestMethod.GET,
            RequestMethod.POST,
            RequestMethod.PUT,
            RequestMethod.PATCH,
            RequestMethod.DELETE
        },
        produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE
    )
    @Operation(
        summary = "Care is local",
        description = "Refuses the advertised care path. Hunger, rest, and bond stay on the keeper machine. Not a license check.",
        responses = @ApiResponse(
            responseCode = "409",
            description = "Care is local. This path is not a door.",
            content = @Content(
                mediaType = MediaType.APPLICATION_PROBLEM_JSON_VALUE,
                schema = @Schema(implementation = ProblemDetail.class)
            )
        )
    )
    public ResponseEntity<ProblemDetail> refuse(HttpServletRequest request) {
        String path = request.getRequestURI();
        String verb = verbOf(path);
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            REFUSAL,
            "Care is local. " + path + " is not a door.");
        pd.setTitle("Care is local");
        pd.setProperty("door", "local");
        pd.setProperty("performed", Boolean.FALSE);
        pd.setProperty("verb", verb);
        return ResponseEntity.status(REFUSAL)
            .contentType(MediaType.APPLICATION_PROBLEM_JSON)
            .body(pd);
    }

    static String verbOf(String path) {
        if (path == null) return "";
        int slash = path.lastIndexOf('/');
        return slash < 0 ? path : path.substring(slash + 1);
    }
}
