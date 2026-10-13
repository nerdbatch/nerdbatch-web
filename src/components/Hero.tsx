import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { bunnyEmbedUrl, useBunnyPlayer } from "@/lib/bunnyPlayer";
import { claimPlayback, onOtherClaim } from "@/lib/mediaCoordinator";
import { useInView, usePageVisible } from "@/hooks/use-in-view";
import heroThumb1 from "@/assets/hero-thumb-1.jpg";
import heroThumb2 from "@/assets/hero-thumb-2.jpg";
import heroThumb3 from "@/assets/hero-thumb-3.jpg";
import heroThumb4 from "@/assets/hero-thumb-4.jpg";

const heroContent = {
  headline: "We don't make ads, we make hundreds of them",
  subheadline:
    "High-volume creative production for DTC brands ready to scale Meta & TikTok. Research-driven. Systematically produced. Built to find winners faster.",
  stats: "49+ Videos Weekly | 23 Team Members | 100% Performance Focused",
};

const videoPlaceholders = [
  { id: 1, videoId: "39e5526f-41c5-4cfe-8e23-4dc75c3b02e5", thumbnail: heroThumb1 },
  { id: 2, videoId: "310378ec-7dec-441f-9f55-d92d3c20b310", thumbnail: heroThumb2 },
  { id: 3, videoId: "6a474f29-f71c-4fca-aef8-b9498bc1c02a", thumbnail: heroThumb3 },
  { id: 4, videoId: "93d66ef3-c4d3-4c63-89b9-6435f90a6011", thumbnail: heroThumb4 },
];

const ROTATE_MS = 10000;
const BLOCKED_MS = 4000;
const FALLBACK_MS = 3000;

const Hero = () => {
  const total = videoPlaceholders.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unmuted, setUnmuted] = useState(false);
  const [yielded, setYielded] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [manualAttempt, setManualAttempt] = useState(0);
  const frameWrapperRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const inView = useInView(frameWrapperRef, { threshold: 0.35 });
  const pageVisible = usePageVisible();
  const onScreen = inView && pageVisible;
  const active = onScreen && !userPaused && !yielded;

  const mountKey = onScreen && !yielded ? `${currentIndex}-${showControls ? "c" : "n"}` : null;
  const { status, send } = useBunnyPlayer(iframeRef, mountKey, (seconds, duration) => {
    // With sound on, let the clip finish, then mute and move on
    if (unmutedRef.current && seconds >= duration - 0.4) {
      unmutedRef.current = false;
      setUnmuted(false);
      setCurrentIndex((p) => (p + 1) % total);
    }
  });
  const unmutedRef = useRef(unmuted);
  unmutedRef.current = unmuted;

  // New slide: reset per-player flags
  useEffect(() => {
    setBlocked(false);
    setShowControls(false);
    setManualAttempt(0);
  }, [currentIndex]);

  // Another Bunny video on the page started: stop here
  useEffect(
    () =>
      onOtherClaim("hero", () => {
        setUnmuted(false);
        setUserPaused(true);
        setYielded(true);
        setShowControls(false);
        setManualAttempt(0);
      }),
    [],
  );

  // Leaving the screen or hiding the tab drops sound; it never comes back on its own
  useEffect(() => {
    if (!onScreen) {
      setUnmuted(false);
      setManualAttempt(0);
      setShowControls(false);
    }
  }, [onScreen]);

  // Drive the mounted player
  const playerReady = status !== "loading" && status !== "error";
  useEffect(() => {
    if (!playerReady) return;
    if (active) {
      if (unmuted) {
        send("unmute");
        send("setVolume", 100);
      } else {
        send("mute");
      }
      send("play");
    } else {
      send("mute");
      send("pause");
    }
  }, [playerReady, active, unmuted, mountKey, send]);

  // Autoplay didn't start: offer a manual play button
  useEffect(() => {
    if (!active || status === "playing" || status === "error" || showControls) {
      if (status === "playing") setBlocked(false);
      return;
    }
    const t = window.setTimeout(() => setBlocked(true), BLOCKED_MS);
    return () => clearTimeout(t);
  }, [active, status, mountKey, showControls]);

  // Auto-rotate, only while silently playing on screen
  useEffect(() => {
    if (!active || status !== "playing" || unmuted || blocked || showControls) return;
    const t = window.setTimeout(() => setCurrentIndex((p) => (p + 1) % total), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, status, unmuted, blocked, showControls, currentIndex, total]);

  const resetForSlide = () => {
    setUnmuted(false);
    setUserPaused(false);
    setYielded(false);
    setManualAttempt(0);
    setShowControls(false);
    setBlocked(false);
    claimPlayback("hero");
  };
  const goToSlide = (index: number) => {
    resetForSlide();
    setCurrentIndex(index);
  };
  const goPrev = () => {
    resetForSlide();
    setCurrentIndex((p) => (p - 1 + total) % total);
  };
  const goNext = () => {
    resetForSlide();
    setCurrentIndex((p) => (p + 1) % total);
  };

  // Clicking the video toggles pause
  const toggleVideoPause = () => {
    if (showControls) return;
    if (userPaused || blocked) {
      manualPlay();
    } else {
      setUnmuted(false);
      setUserPaused(true);
    }
  };

  useEffect(() => {
    if (!manualAttempt || !active || showControls || status === "playing" || status === "error") return;
    const timer = window.setTimeout(() => setShowControls(true), FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [manualAttempt, active, showControls, status, mountKey]);
  const manualPlay = () => {
    claimPlayback("hero");
    setUserPaused(false);
    setYielded(false);
    setBlocked(false);
    send("play");
    setManualAttempt((attempt) => attempt + 1);
  };

  const handleSoundToggle = () => {
    if (unmuted) {
      setUnmuted(false);
      return;
    }
    claimPlayback("hero");
    setUserPaused(false);
    setYielded(false);
    setBlocked(false);
    setUnmuted(true);
    // Keep the stream and send commands during the user's gesture.
    send("setVolume", 100);
    send("unmute");
    send("play");
    setManualAttempt((attempt) => attempt + 1);
  };

  const current = videoPlaceholders[currentIndex];
  const iframeSrc = bunnyEmbedUrl(current.videoId, {
    autoplay: true,
    muted: true,
    controls: showControls,
  });
  const isPlaying = status === "playing";

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container-max section-padding pt-24 md:pt-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">Creative Engineering</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6">
              We don't make
              <br />
              ads, we make
              <br />
              <span className="relative inline-block">
                hundreds
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{" "}
              of them
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10">
              High-volume creative production for DTC brands ready to scale Meta & TikTok. Research-driven.
              Systematically produced. Built to find winners faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button variant="primary" size="lg" className="group" asChild>
                <a href="#contact">
                  Let's Talk Volume
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#work">See Our Work</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-2xl md:text-3xl font-black text-nerdbatch-gold">49+</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Videos Weekly</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black">23</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Team Members</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black">100%</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Performance Focused</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Video Carousel */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Adaptive Video Frame */}
            <div className="relative w-[280px] md:w-[320px]">
              {/* Main Video Display - Adaptive aspect ratio */}
              <div
                ref={frameWrapperRef}
                onClick={toggleVideoPause}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-nerdbatch-dark cursor-pointer"
              >
                <img
                  key={current.id}
                  src={current.thumbnail}
                  alt=""
                  width={640}
                  height={1138}
                  loading={onScreen ? "eager" : "lazy"}
                  {...{ fetchpriority: currentIndex === 0 ? "high" : "auto" }}
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    !isPlaying ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                />

                {/* Only the active slide has a live player */}
                {mountKey && (
                  <iframe
                    key={mountKey}
                    ref={iframeRef}
                    src={iframeSrc}
                    title={`NerdBatch showcase video ${currentIndex + 1}`}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                      showControls
                        ? "z-30 opacity-100"
                        : `pointer-events-none z-[5] ${isPlaying ? "opacity-100" : "opacity-0"}`
                    }`}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                )}

                {(blocked || userPaused || status === "blocked") && !showControls && status !== "error" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      manualPlay();
                    }}
                    className="absolute inset-0 z-20 m-auto w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                    aria-label="Play video"
                  >
                    <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                  </button>
                )}

                {status === "error" && (
                  <p
                    role="status"
                    className="absolute bottom-14 inset-x-3 z-20 text-center text-xs text-white bg-black/70 rounded px-2 py-1"
                  >
                    Video unavailable
                  </p>
                )}

                {/* Sound toggle */}
                {!showControls && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleSoundToggle();
                    }}
                    className="absolute bottom-3 right-3 z-20 p-2 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
                    aria-label={unmuted ? "Mute video" : "Unmute video"}
                  >
                    {unmuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={goPrev}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {videoPlaceholders.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-primary w-6"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={goNext}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Next video"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
