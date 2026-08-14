import { createFileRoute, Link } from "@tanstack/react-router";
import { DemoStage } from "@/components/desk/demo-stage";
import { livingBySlug } from "@/lib/pets/living";

export const Route = createFileRoute("/demo/$slug")({
  component: DemoPage,
  head: ({ params }) => {
    const kind = livingBySlug(params.slug);
    const title = kind ? `${kind.name} — ComputerPets` : "ComputerPets";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: kind?.tagline ?? "A living desk companion.",
        },
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
