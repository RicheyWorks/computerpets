import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { optionalAuthMiddleware } from "@/lib/auth/middleware";
import { houseKeyFlags } from "@/lib/pets/talk-spend";
import { nameListener } from "./listener";

const input = z
  .object({
    plugin: z.string().trim().max(32).optional(),
    baseUrl: z.string().trim().max(240).optional(),
  })
  .strict();

/**
 * Who the desk will actually ask. Guests are House lines.
 * A signed-in cloud name requires the house env key. The key is not returned.
 * `apiKey` is rejected by the validator.
 */
export const readMindListener = createServerFn({ method: "POST" })
  .middleware([optionalAuthMiddleware])
  .validator((raw: unknown) => input.parse(raw ?? {}))
  .handler(async ({ data, context }) => {
    return nameListener({
      door: "desk",
      plugin: data.plugin,
      baseUrl: data.baseUrl,
      signedIn: Boolean(context.userId),
      houseKeys: houseKeyFlags(),
    });
  });
