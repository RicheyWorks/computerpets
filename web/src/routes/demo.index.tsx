import { createFileRoute, redirect } from "@tanstack/react-router";

// README and START-HERE send a new keeper to "the `/demo` room", but only /demo/<name> existed, so a bare
// /demo was the site's 404. It now opens Rui's room, the house default. A mistyped /demo/<name> stays a 404.
export const Route = createFileRoute("/demo/")({
  beforeLoad: () => {
    throw redirect({ to: "/demo/$slug", params: { slug: "rui" }, replace: true });
  },
});
