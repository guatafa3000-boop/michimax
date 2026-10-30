"use client";

import { useRef } from "react";
import type { Show } from "@/lib/catalog";
import { FeedClip } from "./FeedClip";
import styles from "./ForYouFeed.module.css";

/** Feed vertical a pantalla completa que encaja un clip por pantalla. */
export function ForYouFeed({ shows }: { shows: Show[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function go(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ top: direction * scroller.clientHeight, behavior: "smooth" });
  }

  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        <div ref={scrollerRef} className={styles.scroller} role="region" tabIndex={0} aria-label="Feed de clips Para ti">
          {shows.map((show) => (
            <FeedClip key={show.slug} show={show} />
          ))}
        </div>
        <div className={styles.arrows}>
          <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label="Clip anterior">
            ↑
          </button>
          <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label="Clip siguiente">
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
