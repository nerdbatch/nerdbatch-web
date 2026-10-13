import { useCallback, useEffect, useRef, useState } from "react";

export const BUNNY_LIBRARY = "756869";

/** Build a Bunny Stream embed URL. levelCap=true caps quality to the player size. */
export const bunnyEmbedUrl = (
  videoId: string,
  opts: { autoplay: boolean; muted: boolean; controls?: boolean; loop?: boolean },
) => {
  const p = new URLSearchParams({
    autoplay: String(opts.autoplay),
    muted: String(opts.muted),
    loop: String(opts.loop ?? true),
    preload: "true",
    responsive: "true",
    playsinline: "true",
    levelCap: "true",
  });
  if (opts.controls !== undefined) p.set("controls", String(opts.controls));
  return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY}/${videoId}?${p.toString()}`;
};

export type PlayerStatus = "loading" | "ready" | "playing" | "paused" | "blocked" | "error";

const LISTEN_EVENTS = ["play", "pause", "ended", "error", "timeupdate"];

/**
 * Talks to a Bunny iframe through the official Player.js protocol.
 * Commands sent before `ready` are queued; messages from other frames
 * (or a frame that has since been removed) are ignored.
 */
export const useBunnyPlayer = (
  iframeRef: React.RefObject<HTMLIFrameElement>,
  mountKey: string | null,
  onTimeUpdate?: (seconds: number, duration: number) => void,
) => {
  const [state, setState] = useState<{ key: string | null; status: PlayerStatus }>({
    key: mountKey,
    status: "loading",
  });
  const session = useRef<{ key: string; window: Window; origin: string; ready: boolean } | null>(null);
  const queue = useRef<{ method: string; value?: unknown }[]>([]);
  const timeCb = useRef(onTimeUpdate);
  timeCb.current = onTimeUpdate;

  const post = useCallback((method: string, value?: unknown, listener?: string) => {
    const current = session.current;
    if (!current) return;
    const payload: Record<string, unknown> = { context: "player.js", method };
    if (value !== undefined) payload.value = value;
    if (listener) payload.listener = listener;
    current.window.postMessage(JSON.stringify(payload), current.origin);
  }, []);

  const send = useCallback(
    (method: string, value?: unknown) => {
      if (!mountKey || session.current?.key !== mountKey) return;
      if (!session.current.ready) {
        queue.current.push({ method, value });
        return;
      }
      post(method, value);
    },
    [mountKey, post],
  );

  useEffect(() => {
    session.current = null;
    queue.current = [];
    setState({ key: mountKey, status: "loading" });
    if (!mountKey) return;
    const frame = iframeRef.current;
    const win = frame?.contentWindow;
    if (!frame || !win) return;
    const origin = new URL(frame.src).origin;
    session.current = { key: mountKey, window: win, origin, ready: false };
    let alive = true;
    let previousTime: number | null = null;
    const setStatus = (status: PlayerStatus) =>
      setState((previous) =>
        previous.key === mountKey && previous.status === status ? previous : { key: mountKey, status },
      );

    const onMessage = (event: MessageEvent) => {
      if (!alive) return;
      if (event.source !== win || event.origin !== origin) return;
      let raw: unknown = event.data;
      if (typeof raw === "string") {
        try {
          raw = JSON.parse(raw);
        } catch {
          return;
        }
      }
      if (!raw || typeof raw !== "object") return;
      const data = raw as {
        context?: string;
        event?: string;
        value?: { seconds?: number; duration?: number; code?: number };
      };
      if (data.context !== "player.js") return;
      switch (data.event) {
        case "ready":
          if (!session.current || session.current.ready) return;
          session.current.ready = true;
          setStatus("ready");
          LISTEN_EVENTS.forEach((e) => post("addEventListener", e, e));
          queue.current.splice(0).forEach((c) => post(c.method, c.value));
          break;
        case "play":
          // Bunny can echo a play command before playback actually succeeds.
          // Keep the poster until timeupdate confirms the video is advancing.
          break;
        case "pause":
        case "ended":
          setStatus("paused");
          previousTime = null;
          break;
        case "error":
          if (data.value?.code === 5) setStatus("blocked");
          else if (data.value?.code !== 2 && data.value?.code !== 3) setStatus("error");
          break;
        case "timeupdate": {
          const { seconds, duration } = data.value ?? {};
          if (typeof seconds === "number" && Number.isFinite(seconds)) {
            if (previousTime !== null && seconds > previousTime) {
              setStatus("playing");
              if (duration) timeCb.current?.(seconds, duration);
            }
            previousTime = seconds;
          }
          break;
        }
      }
    };
    window.addEventListener("message", onMessage);
    // Recover a ready event that fired before our effect subscribed.
    const requestReady = () => post("addEventListener", "ready", "ready");
    frame.addEventListener("load", requestReady);
    requestReady();
    return () => {
      alive = false;
      frame.removeEventListener("load", requestReady);
      window.removeEventListener("message", onMessage);
      if (session.current?.key === mountKey) {
        // React may already have removed the browsing context during cleanup.
        if (frame.isConnected) {
          LISTEN_EVENTS.forEach((e) => post("removeEventListener", e, e));
          post("removeEventListener", "ready", "ready");
        }
        session.current = null;
        queue.current = [];
      }
    };
  }, [mountKey, iframeRef, post]);

  const status = state.key === mountKey ? state.status : "loading";
  return { status, send };
};
