import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoStage } from "@/components/desk/demo-stage";
import { livingBySlug } from "@/lib/pets/living";

const host = import.meta.env.VITE_PUBLIC_HOSTNAME;

export const Route = createFileRoute("/demo/$slug")({
  component: DemoPage,
  head: ({ params }) => {
    const kind = livingBySlug(params.slug);
    const title = kind ? `${kind.name} is already walking` : "ComputerPets";
    const pageTitle = kind ? `${kind.name} — ComputerPets` : "ComputerPets";
    const description = kind
      ? `${kind.name}. ${kind.tagline} The demo is a room.`
      : "A living desk companion.";
    const image = host
      ? `https://${host}${kind ? `/pets/${kind.key}.jpg` : "/og.jpg"}`
      : undefined;
    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
    };
  },
});

function DemoPage() {
  const { slug } = Route.useParams();
  const kind = livingBySlug(slug);

  if (!kind) {
    return (
      <main className="mx-auto max-w-lg space-y-3 px-6 py-20">
        <h1 className="font-display text-3xl">No demo for that name.</h1>
        <Link to="/meet" className="text-sm text-primary">
          See who is awake
        </Link>
      </main>
    );
  }

  return <DemoStage kind={kind} />;
}
