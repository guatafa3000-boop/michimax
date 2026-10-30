"use client";

import { useId, useState, type FormEvent } from "react";
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
  const inputId = useId();

  function submit(event: FormEvent) {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    setComments((current) => [{ id: `nuevo-${current.length}`, author: "Tú", text: clean }, ...current]);
    setText("");
  }

  return (
    <section className={styles.sheet} role="dialog" aria-label={`Comentarios de ${title}`} hidden={!open}>
      <header className={styles.head}>
        <h2 className={styles.heading}>Comentarios ({comments.length})</h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar comentarios">
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
