import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { LiveStage } from "@/components/desk/live-stage";
import { sitLiveKind } from "@/lib/pets/live";

const searchSchema = z.object({
  pet: z.union([z.string(), z.array(z.string())]).optional(),
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
  const kind = sitLiveKind(pet);
  return <LiveStage initial={kind} />;
}
