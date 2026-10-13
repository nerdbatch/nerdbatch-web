import { useEffect, useState } from "react";

/** True while the element intersects the viewport (with optional margin). */
export const useInView = <T extends Element>(ref: React.RefObject<T>, options: IntersectionObserverInit = {}) => {
  const [inView, setInView] = useState(false);
  const { rootMargin, threshold } = options;
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const minimumRatio = typeof threshold === "number" ? threshold : 0;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting && e.intersectionRatio >= minimumRatio), {
      rootMargin,
      threshold,
    });
    io.observe(node);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold]);
  return inView;
};

/** True while the tab is visible. */
export const usePageVisible = () => {
  const [visible, setVisible] = useState(
    typeof document === "undefined" ? true : document.visibilityState !== "hidden",
  );
  useEffect(() => {
    const h = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, []);
  return visible;
};
