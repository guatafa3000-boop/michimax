"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CLIP_CAPTIONS_PATH,
  clipPath,
  getCategory,
  stillPath,
  type Show,
} from "@/lib/catalog";
import { CommentsSheet } from "./CommentsSheet";
import styles from "./FeedClip.module.css";

const DOUBLE_TAP_MS = 300;

/** Quien pidió menos movimiento en su sistema no recibe reproducción automática. */
function prefersReducedMotion(): boolean {
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
}

/** Un clip del feed «Para ti»: se reproduce solo cuando ocupa la pantalla y se pausa al salir. */
export function FeedClip({ show }: { show: Show }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTap = useRef(0);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const reduced = prefersReducedMotion();
    setReducedMotion(reduced);
    if (reduced || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          video.play()?.catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play()?.catch(() => undefined);
    else video.pause();
  }

  function handleTap() {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      setLiked(true);
      setBurst((n) => n + 1);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  }

  return (
    <section ref={sectionRef} className={styles.clip} aria-label={show.title}>
      <div className={styles.stage} onClick={handleTap}>
        <video
          ref={videoRef}
          className={styles.video}
          muted
          loop={!reducedMotion}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          playsInline
          preload="metadata"
          poster={stillPath(show.slug)}
          aria-label={`Clip de ${show.title}`}
          onTimeUpdate={(event) => {
            const { currentTime, duration } = event.currentTarget;
            setProgress(duration ? currentTime / duration : 0);
          }}
        >
          <source src={clipPath(show.slug)} type="video/mp4" />
          <track
            kind="captions"
            src={CLIP_CAPTIONS_PATH}
            srcLang="es-MX"
            label="Español (México)"
            default
          />
        </video>
        {burst > 0 && (
          <span key={burst} className={styles.burst} aria-hidden="true">
            ♥
          </span>
        )}
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{show.title}</h2>
        <p className={styles.meta}>
          {getCategory(show.category).name} ·{" "}
          <span className={styles.match}>{show.match}% de coincidencia</span>
        </p>
        <Link href={`/titulos/${show.slug}`} className={styles.watch}>
          Ver título
        </Link>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.action} ${liked ? styles.liked : ""}`}
          aria-pressed={liked}
          onClick={() => setLiked((current) => !current)}
        >
          <span aria-hidden="true">♥</span>
          <span className="visually-hidden">Me encanta</span>
        </button>
        {reducedMotion && (
          <button
            type="button"
            className={styles.action}
            aria-pressed={playing}
            onClick={togglePlayback}
          >
            <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
            <span className="visually-hidden">
              {playing ? "Pausar clip" : "Reproducir clip"}
            </span>
          </button>
        )}
        <button
          type="button"
          className={styles.action}
          onClick={() => setCommentsOpen(true)}
        >
          <span aria-hidden="true">💬</span>
          <span className="visually-hidden">Comentarios</span>
        </button>
      </div>

      <div
        className={styles.progress}
        role="progressbar"
        aria-label="Progreso del clip"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className={styles.progressFill}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <CommentsSheet
        title={show.title}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />
    </section>
  );
}
