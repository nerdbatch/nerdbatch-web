import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Hero from "@/components/Hero";
import OurWork from "@/components/OurWork";
import ProcessAnimation from "@/components/ProcessAnimation";
import { useBunnyPlayer } from "@/lib/bunnyPlayer";

const origin = "https://iframe.mediadelivery.net";
const observers: TestObserver[] = [];
class TestObserver {
  node?: Element;
  constructor(public callback: IntersectionObserverCallback, public options: IntersectionObserverInit) {
    observers.push(this);
  }
  observe(node: Element) { this.node = node; }
  disconnect() { this.node = undefined; }
  unobserve() {}
  takeRecords() { return []; }
  emit(ratio: number) {
    if (!this.node) return;
    this.callback([{ target: this.node, isIntersecting: ratio > 0, intersectionRatio: ratio } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

function message(frame: HTMLIFrameElement, event: string, value?: unknown, eventOrigin = origin) {
  act(() => window.dispatchEvent(new MessageEvent("message", {
    source: frame.contentWindow,
    origin: eventOrigin,
    data: JSON.stringify({ context: "player.js", event, value }),
  })));
}
function advance(frame: HTMLIFrameElement) {
  message(frame, "timeupdate", { seconds: 0, duration: 60 });
  message(frame, "timeupdate", { seconds: 0.5, duration: 60 });
}
function visible(ratio = 1) {
  act(() => observers.forEach((observer) => observer.emit(ratio)));
}
function Harness({ id = "one" }: { id?: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const { status, send } = useBunnyPlayer(ref, id);
  return <><iframe key={id} ref={ref} src={`${origin}/embed/756869/${id}`} title="Test player" /><output>{status}</output><button onClick={() => send("play")}>Start</button></>;
}

beforeEach(() => {
  vi.useFakeTimers();
  observers.length = 0;
  vi.stubGlobal("IntersectionObserver", TestObserver);
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Bunny playback lifecycle", () => {
  it("waits for ready and confirms advancing time rather than an echoed play command", () => {
    render(<Harness />);
    const frame = screen.getByTitle("Test player") as HTMLIFrameElement;
    const post = vi.spyOn(frame.contentWindow!, "postMessage");
    fireEvent.click(screen.getByText("Start"));
    expect(post).not.toHaveBeenCalled();
    message(frame, "ready", {}, "https://unrelated.example");
    expect(screen.getByRole("status")).toHaveTextContent("loading");
    message(frame, "ready");
    expect(post.mock.calls.some(([payload]) => JSON.parse(payload as string).method === "play")).toBe(true);
    message(frame, "play");
    message(frame, "timeupdate", { seconds: 0, duration: 60 });
    message(frame, "timeupdate", { seconds: 0, duration: 60 });
    expect(screen.getByRole("status")).toHaveTextContent("ready");
    advance(frame);
    expect(screen.getByRole("status")).toHaveTextContent("playing");
    message(frame, "pause");
    message(frame, "timeupdate", { seconds: 0.5, duration: 60 });
    expect(screen.getByRole("status")).toHaveTextContent("paused");
  });

  it("recovers blocked playback and ignores events from a removed iframe", () => {
    const { rerender } = render(<Harness />);
    const old = screen.getByTitle("Test player") as HTMLIFrameElement;
    message(old, "ready");
    message(old, "error", { code: 5, msg: "NotAllowedError" });
    expect(screen.getByRole("status")).toHaveTextContent("blocked");
    advance(old);
    expect(screen.getByRole("status")).toHaveTextContent("playing");
    rerender(<Harness id="two" />);
    expect(screen.getByRole("status")).toHaveTextContent("loading");
    message(old, "error");
    expect(screen.getByRole("status")).toHaveTextContent("loading");
    message(screen.getByTitle("Test player") as HTMLIFrameElement, "ready");
    expect(screen.getByRole("status")).toHaveTextContent("ready");
  });
});

describe("page media behavior", () => {
  it("keeps the hero iframe when enabling sound and removes it when the tab hides", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(container.querySelector("iframe")).toBeNull();
    visible(0.1);
    expect(container.querySelector("iframe")).toBeNull();
    visible();
    const frame = container.querySelector("iframe")!;
    const post = vi.spyOn(frame.contentWindow!, "postMessage");
    message(frame, "ready");
    advance(frame);
    fireEvent.click(screen.getByRole("button", { name: "Unmute video" }));
    expect(container.querySelector("iframe")).toBe(frame);
    expect(post.mock.calls.some(([payload]) => {
      const data = JSON.parse(payload as string);
      return data.method === "setVolume" && data.value === 100;
    })).toBe(true);
    act(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
      document.dispatchEvent(new Event("visibilitychange"));
      vi.advanceTimersByTime(15000);
    });
    expect(container.querySelector("iframe")).toBeNull();
    act(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    expect(new URL(container.querySelector("iframe")!.src).searchParams.get("muted")).toBe("true");
    expect(screen.getByRole("button", { name: "Unmute video" })).toBeInTheDocument();
  });

  it("does not preload the portfolio and replaces the hero when a card is clicked", () => {
    const { container } = render(<><Hero /><OurWork /></>);
    visible();
    expect(container.querySelectorAll("iframe")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Play portfolio video 1" }));
    expect(container.querySelectorAll("iframe")).toHaveLength(1);
    expect(screen.getByTitle("Portfolio video 1")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Play portfolio video 2" }));
    expect(container.querySelectorAll("iframe")).toHaveLength(1);
    expect(screen.getByTitle("Portfolio video 2")).toBeInTheDocument();
    visible(0);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
  });

  it("exposes clickable, uncropped controls when manual portfolio playback still fails", () => {
    const { container } = render(<OurWork />);
    visible();
    fireEvent.click(screen.getByRole("button", { name: "Play portfolio video 1" }));
    message(container.querySelector("iframe")!, "ready");
    act(() => vi.advanceTimersByTime(4000));
    fireEvent.click(screen.getByRole("button", { name: "Play portfolio video 1" }));
    act(() => vi.advanceTimersByTime(3000));
    const frame = container.querySelector("iframe")!;
    expect(new URL(frame.src).searchParams.get("controls")).toBe("true");
    expect(frame.className).not.toContain("pointer-events-none");
    expect(frame.className).not.toContain("128%");
  });

  it("cancels an old hero fallback when the visitor changes slides", () => {
    const { container } = render(<Hero />);
    visible();
    message(container.querySelector("iframe")!, "ready");
    act(() => vi.advanceTimersByTime(4000));
    fireEvent.click(screen.getByRole("button", { name: "Play video" }));
    fireEvent.click(screen.getByRole("button", { name: "Next video" }));
    act(() => vi.advanceTimersByTime(3000));
    const frame = container.querySelector("iframe")!;
    expect(frame.title).toBe("NerdBatch showcase video 2");
    expect(new URL(frame.src).searchParams.get("controls")).toBe("false");
  });

  it("keeps animation sources detached for reduced-motion visitors", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    const { container } = render(<ProcessAnimation mp4="clip.mp4" webm="clip.webm" poster="poster.jpg" label="Research" />);
    visible();
    expect(container.querySelectorAll("source")).toHaveLength(0);
    expect(container.querySelector("video")?.poster).toContain("poster.jpg");
  });

  it("loads animation sources only near the viewport and loads before playing", () => {
    const calls: string[] = [];
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => { calls.push("load"); });
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => { calls.push("play"); return Promise.resolve(); });
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => { calls.push("pause"); });
    const { container } = render(<ProcessAnimation mp4="clip.mp4" webm="clip.webm" poster="poster.jpg" label="Research" />);
    expect(container.querySelectorAll("source")).toHaveLength(0);
    visible();
    expect(container.querySelectorAll("source")).toHaveLength(2);
    expect(calls.slice(0, 2)).toEqual(["load", "play"]);
    visible(0);
    expect(calls[calls.length - 1]).toBe("pause");
  });
});
