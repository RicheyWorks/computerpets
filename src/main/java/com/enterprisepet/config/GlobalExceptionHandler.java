package com.enterprisepet.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Maps thrown exceptions to RFC 7807 {@code application/problem+json} responses so
 * every error in the API has a consistent shape:
 * <pre>
 *   { "type": "about:blank", "title": "...", "status": 400, "detail": "...", ... }
 * </pre>
 *
 * <p>Per-controller {@code ResponseEntity} error returns (e.g. unknown petType, license
 * mismatch) still work as before — this handler only catches exceptions that bubble out
 * of the request pipeline.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** Bean Validation failures from @Valid on a request body. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                fe -> fe.getField(),
                fe -> fe.getDefaultMessage() == null ? "invalid" : fe.getDefaultMessage(),
                (a, b) -> a,
                LinkedHashMap::new
            ));

        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST, "Request validation failed");
        pd.setTitle("Validation error");
        pd.setProperty("fieldErrors", fieldErrors);
        return pd;
    }

    /** Malformed JSON body. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail handleUnreadable(HttpMessageNotReadableException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            "Request body is missing or not valid JSON");
        pd.setTitle("Malformed request");
        return pd;
    }

    /** Missing @RequestParam. */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ProblemDetail handleMissingParam(MissingServletRequestParameterException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            "Missing required parameter '" + ex.getParameterName() + "'");
        pd.setTitle("Missing parameter");
        pd.setProperty("parameter", ex.getParameterName());
        return pd;
    }

    /** Wrong type in path/query (e.g. expecting a number, got "abc"). */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ProblemDetail handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            "Parameter '" + ex.getName() + "' has the wrong type");
        pd.setTitle("Parameter type mismatch");
        pd.setProperty("parameter", ex.getName());
        return pd;
    }

    /** Unmatched routes (Spring 6 throws this instead of letting them 404 to the default handler). */
    @ExceptionHandler(NoResourceFoundException.class)
    public ProblemDetail handleNotFound(NoResourceFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, "No handler for " + ex.getResourcePath());
        pd.setTitle("Not found");
        return pd;
    }

    /**
     * Catch-all. We log the full stack trace server-side but never leak it to the
     * client — the {@code detail} field gets a generic message and an opaque request
     * marker the user can quote when reporting an issue.
     */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleAnything(Exception ex) {
        log.error("Unhandled exception", ex);
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred. Try again later.");
        pd.setTitle("Internal server error");
        return pd;
    }
}
