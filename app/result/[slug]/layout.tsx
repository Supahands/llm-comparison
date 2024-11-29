import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/supabaseServerClient";
import { DATABASE_TABLE } from "@/lib/constants/databaseTables";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from(DATABASE_TABLE.RESPONSE)
    .select("model_1, model_2")
    .eq("session_id", slug)
    .limit(1);

  if (error) {
    return {
      title: "Not Found",
      openGraph: {
        images: [
          {
            url: "https://cdn.prod.website-files.com/63024b20439fa61d4aee344c/6729815170f000c58463873c_select%20models-p-800.jpg",
          },
        ],
        description: "Session ID is not found!",
        url: `https://eval.supa.so/result/${slug}`,
      },
    };
  }

  const model_1 = data[0].model_1.split(/[/\-]/).slice(0, 4).join("-");
  const model_2 = data[0].model_2.split(/[/\-]/).slice(0, 4).join("-");

  return {
    title: `${model_1} VS ${model_2} - LLM Comparison Results`,
    openGraph: {
      images: [
        {
          url: "https://cdn.prod.website-files.com/63024b20439fa61d4aee344c/6729815170f000c58463873c_select%20models-p-800.jpg",
        },
      ],
      description: `Compare LLMs to find out which one fits your needs best!`,
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
