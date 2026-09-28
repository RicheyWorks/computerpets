// Stand-in for @tanstack/react-router in mount tests: a route keeps its options; Link is a plain anchor.
import { createElement } from "react";
export function createFileRoute() {
  return (options) => ({ options });
}
export function Link({ to, children, ...rest }) {
  return createElement("a", { href: typeof to === "string" ? to : "#", ...rest }, children);
}
export function useNavigate() {
  return () => {};
}
