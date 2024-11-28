import { Metadata, ResolvingMetadata } from "next";
import { Toaster } from "@/components/ui/toaster";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;

  return {
    title: "LLM Comparison Result",
    openGraph: {
      images: [
        {
          url: "https://cdn.prod.website-files.com/63024b20439fa61d4aee344c/6729815170f000c58463873c_select%20models-p-800.jpg",
        },
      ],
      description: "Result of Rounds of Question between two LLMs",
      url: `https://eval.supa.so/result/${slug}`,
    },
  };
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
      <Toaster />
    </section>
  );
}
