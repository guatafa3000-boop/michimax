import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ForYouFeed } from "@/components/ForYouFeed";
import { shows } from "@/lib/catalog";
import { feedShows } from "@/lib/feed";

describe("feedShows", () => {
  it("incluye los 30 títulos sin repetir y mezcla categorías", () => {
    const mixed = feedShows();
    expect(mixed).toHaveLength(30);
    expect(new Set(mixed.map((s) => s.slug)).size).toBe(30);
    expect(mixed[0].category).not.toBe(mixed[1].category);
  });
});

describe("ForYouFeed", () => {
  it("muestra un clip por título con datos y enlace", () => {
    render(<ForYouFeed shows={shows} />);
    expect(screen.getAllByRole("link", { name: "Ver título" })).toHaveLength(30);
    expect(screen.getAllByRole("progressbar")).toHaveLength(30);
    expect(screen.getAllByText(/% de coincidencia/)).toHaveLength(30);
  });

  it("tiene flechas para anterior y siguiente", async () => {
    render(<ForYouFeed shows={shows.slice(0, 2)} />);
    const scroller = screen.getByLabelText("Feed de clips Para ti");
    scroller.scrollBy = vi.fn() as unknown as typeof scroller.scrollBy;
    await userEvent.click(screen.getByRole("button", { name: "Clip siguiente" }));
    expect(scroller.scrollBy).toHaveBeenCalled();
  });

  it("el doble toque da me encanta", () => {
    const { container } = render(<ForYouFeed shows={shows.slice(0, 1)} />);
    const stage = container.querySelector("video")!.parentElement!;
    fireEvent.click(stage);
    fireEvent.click(stage);
    expect(screen.getByRole("button", { name: "Me encanta" })).toHaveAttribute("aria-pressed", "true");
  });

  it("agrega comentarios en el panel", async () => {
    render(<ForYouFeed shows={shows.slice(0, 1)} />);
    await userEvent.click(screen.getByRole("button", { name: "Comentarios" }));
    await userEvent.type(screen.getByLabelText("Agrega un comentario"), "¡Qué bonito!");
    await userEvent.click(screen.getByRole("button", { name: "Publicar" }));
    expect(screen.getByText("¡Qué bonito!")).toBeInTheDocument();
  });
});
