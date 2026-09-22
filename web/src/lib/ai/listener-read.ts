import { createServerFn } from "@tanstack/react-start";
import { optionalAuthMiddleware } from "@/lib/auth/middleware";
import { houseKeyFlags } from "@/lib/pets/talk-spend";
import { nameListener } from "./listener";
import { parseListenerRead } from "./listener-post";

/**
 * Who the desk will actually ask. Guests are House lines.
 * A signed-in cloud name requires the house env key. The key is not returned.
 * `apiKey` is rejected by the validator.
 * A pasted secret on `baseUrl` is dropped before the house keeps the body.
 */
export const readMindListener = createServerFn({ method: "POST" })
  .middleware([optionalAuthMiddleware])
  .validator((raw: unknown) => parseListenerRead(raw))
  .handler(async ({ data, context }) => {
    return nameListener({
      door: "desk",
      plugin: data.plugin,
      baseUrl: data.baseUrl,
      signedIn: Boolean(context.userId),
      houseKeys: houseKeyFlags(),
    });
  });
