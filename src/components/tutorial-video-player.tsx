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

  const [isMuted, setIsMuted] = useState(true);

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

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [videoUrl]);

  return (
    <div className="tutorial-player-wrapper w-full flex flex-col gap-3">
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

        />

      </div>

    </div>
  );
}
