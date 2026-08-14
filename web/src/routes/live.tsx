import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { LiveStage } from "@/components/desk/live-stage";
import { livingByKey, livingBySlug } from "@/lib/pets/living";

const searchSchema = z.object({
  pet: z.string().optional(),
});

export const Route = createFileRoute("/live")({
  validateSearch: searchSchema,
  component: LivePage,
  head: () => ({
    meta: [
      { title: "Live companion — ComputerPets" },
      {
        name: "description",
        content: "Fullscreen living companion for phones, tablets, and the home screen.",
      },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
  }),
});

function LivePage() {
  const { pet } = Route.useSearch();
  const kind = pet ? (livingBySlug(pet) ?? livingByKey(pet)) : undefined;
  return <LiveStage initial={kind} />;
}
