import type { Metadata } from "next";
import { ForYouFeed } from "@/components/ForYouFeed";
import { feedShows } from "@/lib/feed";

export const metadata: Metadata = {
  title: "Para ti",
  description: "Descubre títulos nuevos deslizando clips verticales de todo Michimax.",
};

export default function ParaTiPage() {
  return (
    <>
      <h1 className="visually-hidden">Para ti: clips de todo Michimax</h1>
      <ForYouFeed shows={feedShows()} />
    </>
  );
}
