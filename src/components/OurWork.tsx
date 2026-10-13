import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { bunnyEmbedUrl, useBunnyPlayer } from "@/lib/bunnyPlayer";
import { claimPlayback, onOtherClaim } from "@/lib/mediaCoordinator";
import { useInView, usePageVisible } from "@/hooks/use-in-view";
import workThumb1 from "@/assets/work-thumb-1.jpg";
import workThumb2 from "@/assets/work-thumb-2.jpg";
import workThumb3 from "@/assets/work-thumb-3.jpg";
import workThumb4 from "@/assets/work-thumb-4.jpg";
import workThumb5 from "@/assets/work-thumb-5.jpg";
import workThumb6 from "@/assets/work-thumb-6.jpg";
import workThumb7 from "@/assets/work-thumb-7.jpg";
import workThumb8 from "@/assets/work-thumb-8.jpg";

const thumbs = [workThumb1, workThumb2, workThumb3, workThumb4, workThumb5, workThumb6, workThumb7, workThumb8];

const videos = [
  "a27b5840-0196-438c-ae55-94e396f4a4f4",
  "34a10f55-5a20-4c72-88b9-3f40577a0373",
  "271dc02b-00a0-4bf4-94e3-fc7778b6e232",
  "2297080a-5738-4249-9da2-40f0ea80d85a",
  "d893d4a6-beef-4e55-893e-65cff96f0082",
  "44152ecc-8aaf-4d8a-92c0-bc33c5d1f3fa",
  "47479996-b380-4a48-be0b-e449b4b3d7aa",
  "d03b455e-3e08-43b0-8d97-ca8bca78331f",
].map((videoId, i) => ({ id: i + 1, videoId, thumbnail: thumbs[i] }));

const BLOCKED_MS = 4000;
const FALLBACK_MS = 3000;

const OurWork = () => {
  // Only the clicked card ever gets a player
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { threshold: 0.2 });
  const pageVisible = usePageVisible();

  const gap = 24;
  const totalItems = videos.length;

  const stop = useCallback(() => setActiveIndex(null), []);

  useEffect(() => onOtherClaim("work", stop), [stop]);
  // Remove the stream offscreen, including when native controls are exposed.
  useEffect(() => {
    if (!inView || !pageVisible) stop();
  }, [inView, pageVisible, stop]);

  const getOffset = useCallback(
    (index: number) => {
      let diff = index - currentPosition;
      if (diff > totalItems / 2) diff -= totalItems;
      if (diff < -totalItems / 2) diff += totalItems;
      return diff;
    },
    [currentPosition, totalItems],
  );

  const goNext = () => {
    stop();
    setCurrentPosition((currentPosition + 1) % totalItems);
  };
  const goPrev = () => {
    stop();
    setCurrentPosition((currentPosition - 1 + totalItems) % totalItems);
  };
  const goToSlide = (index: number) => {
    stop();
    setCurrentPosition(index);
  };

  const activate = (index: number) => {
    claimPlayback("work");
    setCurrentPosition(index);
    setActiveIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="py-12 md:py-16 bg-muted/30 border-t border-border scroll-mt-28 md:scroll-mt-24"
    >
      <div className="container-max px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">Portfolio</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Check out some of our{" "}
            <span className="relative inline-block">
              work
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 100 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 6C25 2 75 2 98 6" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            High-converting video ads crafted for performance
          </p>
        </div>

        {/* Video Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goPrev}
            className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background border border-border shadow-lg hover:bg-muted transition-colors"
            aria-label="Previous videos"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background border border-border shadow-lg hover:bg-muted transition-colors"
            aria-label="Next videos"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel wrapper with fade edges */}
          <div
            className="mx-8 md:mx-12 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            {/* Videos Container */}
            <div className="relative h-[320px] md:h-[360px] lg:h-[400px] flex items-center justify-center">
              {videos.map((video, index) => {
                const offset = getOffset(index);
                const isVisible = Math.abs(offset) <= 5;

                if (!isVisible) return null;

                return (
                  <VideoCard
                    key={video.id}
                    videoId={video.videoId}
                    thumbnail={video.thumbnail}
                    index={index}
                    offset={offset}
                    gap={gap}
                    isActive={activeIndex === index}
                    canPlay={inView && pageVisible}
                    onActivate={() => activate(index)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentPosition === index ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface VideoCardProps {
  videoId: string;
  thumbnail: string;
  index: number;
  offset: number;
  gap: number;
  isActive: boolean;
  canPlay: boolean;
  onActivate: () => void;
}

const VideoCard = ({ videoId, thumbnail, index, offset, gap, isActive, canPlay, onActivate }: VideoCardProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [manualAttempt, setManualAttempt] = useState(0);
  const mountKey = isActive ? `${videoId}-${showControls ? "c" : "n"}` : null;
  const { status, send } = useBunnyPlayer(iframeRef, mountKey);

  // Reset when this card stops being the active one
  useEffect(() => {
    if (!isActive) {
      setUserPaused(false);
      setBlocked(false);
      setShowControls(false);
      setManualAttempt(0);
    }
  }, [isActive]);
  const shouldPlay = isActive && canPlay && !userPaused;
  const live = isActive && status !== "loading" && status !== "error";
  useEffect(() => {
    if (!manualAttempt || !shouldPlay || showControls || status === "playing" || status === "error") return;
    const timer = window.setTimeout(() => setShowControls(true), FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [manualAttempt, shouldPlay, showControls, status, mountKey]);

  // Drive the player once it reports ready; sound comes from the user's click
  useEffect(() => {
    if (!live) return;
    if (shouldPlay) {
      send("unmute");
      send("setVolume", 100);
      send("play");
    } else {
      send("pause");
    }
  }, [live, shouldPlay, mountKey, send]);

  // Leaving the screen pauses; it never resumes on its own
  useEffect(() => {
    if (isActive && !canPlay) setUserPaused(true);
  }, [isActive, canPlay]);

  // Click-started playback didn't begin: offer a manual play button
  useEffect(() => {
    if (!shouldPlay || status === "playing" || status === "error" || showControls) {
      if (status === "playing") setBlocked(false);
      return;
    }
    const t = window.setTimeout(() => setBlocked(true), BLOCKED_MS);
    return () => clearTimeout(t);
  }, [shouldPlay, status, showControls]);

  const manualPlay = () => {
    claimPlayback("work");
    setUserPaused(false);
    setBlocked(false);
    send("unmute");
    send("setVolume", 100);
    send("play");
    setManualAttempt((attempt) => attempt + 1);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (showControls) return;
    if (!isActive) return onActivate();
    if (blocked || userPaused || status === "blocked" || status === "error") return manualPlay();
    setUserPaused(true);
  };

  const isPlaying = isActive && status === "playing";
  const showPausedOverlay = isActive && userPaused && status !== "loading";
  const showPlayButton =
    !showControls && (!isActive || blocked || userPaused || status === "blocked" || status === "error");

  return (
    <div
      className="absolute left-1/2 top-1/2 flex-shrink-0 w-[140px] md:w-[160px] lg:w-[180px] transition-transform duration-300 ease-out"
      style={{
        transform: `translate(calc(-50% + ${offset * 100}% + ${offset * gap}px), -50%)`,
        opacity: Math.abs(offset) <= 3 ? 1 : 0.3,
        zIndex: 10 - Math.abs(offset),
      }}
      onClick={handleClick}
    >
      <div className="relative flex aspect-[9/16] items-center justify-center overflow-hidden rounded-xl cursor-pointer bg-muted">
        <img
          src={thumbnail}
          alt=""
          width={360}
          height={640}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            isPlaying && !showControls ? "opacity-0" : "opacity-100"
          }`}
        />

        {isActive && (
          <div className={`absolute inset-0 overflow-hidden ${showControls ? "z-30" : ""}`}>
            <iframe
              key={mountKey ?? undefined}
              ref={iframeRef}
              src={bunnyEmbedUrl(videoId, {
                autoplay: true,
                muted: false,
                controls: showControls,
              })}
              className={
                showControls
                  ? "absolute inset-0 block h-full w-full border-0"
                  : `pointer-events-none absolute left-1/2 top-1/2 block h-[128%] w-[128%] max-w-none -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-300 ${
                      isPlaying ? "opacity-100" : "opacity-0"
                    }`
              }
              title={`Portfolio video ${index + 1}`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {showPausedOverlay && <div className="absolute inset-0 bg-black/50" />}

        {isActive && status === "error" && (
          <p className="absolute bottom-2 inset-x-2 text-center text-[10px] font-medium text-white/90">
            Video unavailable
          </p>
        )}

        {showPlayButton && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}
            className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg"
            aria-label={`Play portfolio video ${index + 1}`}
          >
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
};

export default OurWork;
