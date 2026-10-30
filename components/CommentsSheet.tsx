"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { sampleComments, type FeedComment } from "@/lib/feed";
import styles from "./CommentsSheet.module.css";

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
};

/** Panel inferior de comentarios. Los comentarios nuevos solo viven en el cliente. */
export function CommentsSheet({ title, open, onClose }: Props) {
  const [comments, setComments] = useState<FeedComment[]>(sampleComments);
  const [text, setText] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const inputId = useId();
  const touchStart = useRef<number | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    setComments((current) => [
      { id: `nuevo-${current.length}`, author: "Tú", text: clean },
      ...current,
    ]);
    setText("");
    setAnnouncement("Comentario publicado");
  }

  return (
    <section
      className={styles.sheet}
      role="dialog"
      aria-label={`Comentarios de ${title}`}
      hidden={!open}
      onKeyDown={(event) => event.key === "Escape" && onClose()}
    >
      <header
        className={styles.head}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientY;
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (start !== null && event.changedTouches[0].clientY - start > 60)
            onClose();
        }}
      >
        <h2 className={styles.heading}>Comentarios ({comments.length})</h2>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Cerrar comentarios"
        >
          ×
        </button>
      </header>
      <ul className={styles.list}>
        {comments.map((comment) => (
          <li key={comment.id} className={styles.comment}>
            <strong>{comment.author}</strong> {comment.text}
          </li>
        ))}
      </ul>
      <p role="status" className="visually-hidden">
        {announcement}
      </p>
      <form className={styles.form} onSubmit={submit}>
        <label className="visually-hidden" htmlFor={inputId}>
          Agrega un comentario
        </label>
        <input
          id={inputId}
          className={styles.input}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Agrega un comentario…"
          maxLength={200}
        />
        <button type="submit" className={styles.send}>
          Publicar
        </button>
      </form>
    </section>
  );
}
