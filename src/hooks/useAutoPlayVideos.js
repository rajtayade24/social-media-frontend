// src/hooks/useAutoPlayVideos.js
import { useEffect, useState } from "react";

export default function useAutoPlayVideos(fileRefs, sounded) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);

  useEffect(() => {
    if (!fileRefs.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        entries.forEach((entry) => {
          if (!best || entry.intersectionRatio > best.intersectionRatio)
            best = entry;
        });

        if (best && best.intersectionRatio >= 0.5) {
          const idx = Number(best.target.dataset.index);
          setActiveVideoIndex(idx);
        } else {
          setActiveVideoIndex(null);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    fileRefs.current.forEach((v) => v && observer.observe(v));

    return () => observer.disconnect();
  }, [fileRefs]);

  useEffect(() => {
    fileRefs.current.forEach((el, i) => {
      if (!el) return;
      if (el.tagName === "VIDEO") {
        if (i === activeVideoIndex) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
        el.muted = !sounded;
      }
    });
  }, [activeVideoIndex, sounded, fileRefs]);

  return { activeVideoIndex, setActiveVideoIndex };
}
