import { createServerFn } from "@tanstack/react-start";
import { hasOwnSignInClient } from "./local-sign-in";

/**
 * Whether this server signs in with a client of its own (see hasOwnSignInClient). Only a yes or no leaves the
 * server: never the id or the secret. The login page reads it to decide whether sign-in can finish on localhost.
 */
export const getSignInReach = createServerFn({ method: "GET" }).handler(async () => ({
  ownClient: hasOwnSignInClient(process.env),
}));
