import { shows, type Show } from "./catalog";

/** Intercala los títulos por categoría (uno de cada categoría por vuelta) para que no salgan dos seguidos del mismo género. */
export function feedShows(list: Show[] = shows): Show[] {
  const groups = new Map<string, Show[]>();
  for (const show of list) {
    groups.set(show.category, [...(groups.get(show.category) ?? []), show]);
  }
  const queues = [...groups.values()];
  const mixed: Show[] = [];
  for (let round = 0; mixed.length < list.length; round++) {
    for (const queue of queues) {
      if (queue[round]) mixed.push(queue[round]);
    }
  }
  return mixed;
}

export type FeedComment = { id: string; author: string; text: string };

export const sampleComments: FeedComment[] = [
  { id: "c1", author: "Michi_Luna", text: "¡Ya quiero ver el título completo! 😻" },
  { id: "c2", author: "Don Bigotes", text: "Mi gato se quedó viendo la pantalla todo el clip." },
  { id: "c3", author: "Fer Garra", text: "La fotografía está increíble." },
  { id: "c4", author: "Paws_MX", text: "Lo agrego a mi lista ahorita mismo." },
];
