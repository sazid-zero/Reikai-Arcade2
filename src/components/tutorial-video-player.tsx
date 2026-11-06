'use client';

import { useState, useRef, useEffect } from 'react';


export type TutorialVideoProps = {
  initialVideoUrl?: string;
  initialPosterUrl?: string;
  initialTitle?: string;
  initialKicker?: string;
  initialTagline?: string;
};

export function TutorialVideoPlayer({
  initialVideoUrl = '/tutorial-sample.mp4',
  initialPosterUrl = '/cat-panel-ps5.jpg',
  initialTitle = 'PLAY YOUR WAY',
  initialKicker = '01 // TUTORIAL GUIDE',
  initialTagline = 'WATCH OUR STEP-BY-STEP ORDERING & REDEMPTION WALKTHROUGH.',
}: TutorialVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [posterUrl, setPosterUrl] = useState(initialPosterUrl);
  const [title, setTitle] = useState(initialTitle);
  const [kicker, setKicker] = useState(initialKicker);
  const [tagline, setTagline] = useState(initialTagline);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch live settings if updated by admin
  useEffect(() => {
    fetch('/api/tutorial-video')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.videoUrl) setVideoUrl(data.videoUrl);
          if (data.posterUrl) setPosterUrl(data.posterUrl);
          if (data.title) setTitle(data.title);
          if (data.kicker) setKicker(data.kicker);
          if (data.tagline) setTagline(data.tagline);
          if (typeof data.muted === 'boolean') setIsMuted(data.muted);
        }
      })
      .catch((err) => console.warn('Could not fetch tutorial video config:', err));
  }, []);

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isNaN(video.duration)) return;
    const current = video.currentTime;
    const dur = video.duration;
    setProgress((current / dur) * 100);
    setCurrentTime(formatTime(current));
    setDuration(formatTime(dur));
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || isNaN(video.duration)) return;
    const target = (parseFloat(e.target.value) / 100) * video.duration;
    video.currentTime = target;
    setProgress(parseFloat(e.target.value));
  };

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [videoUrl]);

  const toggleFullscreen = () => {
    const el = wrapperRef.current || containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  return (
    <div ref={wrapperRef} className="tutorial-player-wrapper w-full flex flex-col gap-3">
      {/* ── Clean Video Player Window (No overlays or text) ── */}
      <div
        ref={containerRef}
        className="tutorial-player-container"
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          className="tutorial-video-media"
          playsInline
          autoPlay
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

      </div>

    </div>
  );
}
