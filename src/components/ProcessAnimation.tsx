import { useEffect, useRef, useState } from "react";
import { useInView, usePageVisible } from "@/hooks/use-in-view";

interface Props {
  mp4: string;
  webm: string;
  poster: string;
  label: string;
}

const prefersStill = () => {
  if (typeof window === "undefined") return true;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return Boolean(reduced || saveData);
};

/** Silent looping clip: sources attach near the viewport, plays only while visible. */
const ProcessAnimation = ({ mp4, webm, poster, label }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [still] = useState(prefersStill);
  const near = useInView(ref, { rootMargin: "300px 0px" });
  const visible = useInView(ref, { threshold: 0.25 });
  const pageVisible = usePageVisible();
  const [armed, setArmed] = useState(false);

  // Load attached sources before attempting play: load() cancels pending play().
  useEffect(() => {
    if (armed) ref.current?.load();
  }, [armed]);

  useEffect(() => {
    if (near && !still) setArmed(true);
  }, [near, still]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !armed) return;
    if (visible && pageVisible) v.play().catch(() => {});
    else v.pause();
  }, [armed, visible, pageVisible]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      width={640}
      height={404}
      className="w-full h-full object-cover"
    >
      {armed && <source src={webm} type="video/webm" />}
      {armed && <source src={mp4} type="video/mp4" />}
    </video>
  );
};

export default ProcessAnimation;
