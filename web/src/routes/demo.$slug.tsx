import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoStage } from "@/components/desk/demo-stage";
import { livingBySlug } from "@/lib/pets/living";

const host = import.meta.env.VITE_PUBLIC_HOSTNAME;

export const Route = createFileRoute("/demo/$slug")({
  component: DemoPage,
  head: ({ params }) => {
    const kind = livingBySlug(params.slug);
    // A mistyped /demo/<name> used to say just "ComputerPets" in the tab,
    // so a new keeper with a few tabs open could not tell it was a dead end.
    const title = kind ? `${kind.name} is already walking` : "No demo here";
    const pageTitle = kind ? `${kind.name} — ComputerPets` : "No demo here — ComputerPets";
    const description = kind
      ? `${kind.name}. ${kind.tagline} The demo is a room.`
      : "No demo for that name. See who is awake instead.";
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
        <Link to="/meet" data-demo-missing className="inline-flex min-h-11 items-center text-sm text-primary">
          See who is awake
        </Link>
      </main>
    );
  }

  return <DemoStage kind={kind} />;
}
