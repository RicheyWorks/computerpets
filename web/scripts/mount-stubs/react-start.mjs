// Stand-in for @tanstack/react-start in mount tests: a server function runs its real validator and handler
// in-process, with the session the test sets on globalThis.__stubSession ({ userId } or null).
export function createServerFn() {
  let validate = (raw) => raw;
  const builder = {
    middleware() {
      return builder;
    },
    validator(fn) {
      validate = fn;
      return builder;
    },
    inputValidator(fn) {
      validate = fn;
      return builder;
    },
    handler(fn) {
      return async (arg = {}) => {
        const data = validate(arg.data);
        const session = globalThis.__stubSession || null;
        return fn({ data, context: { userId: session?.userId ?? null } });
      };
    },
  };
  return builder;
}

export function createMiddleware() {
  const mw = { server: () => mw, client: () => mw, middleware: () => mw };
  return mw;
}
