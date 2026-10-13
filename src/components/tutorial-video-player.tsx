'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Sparkles } from 'lucide-react';

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

  const toggleFullscreen = () => {
    const el = containerRef.current;
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

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  return (
    <div
      ref={containerRef}
      className="tutorial-player-container group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        className="tutorial-video-media"
        playsInline
        autoPlay={false}
        loop
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Ambient gradient darkening overlay */}
      <div className="tutorial-overlay-scrim" onClick={togglePlay} />

      {/* Top HUD Kicker Badge */}
      <div className="tutorial-top-hud">
        <div className="tutorial-kicker-pill">
          <span className="tutorial-live-indicator" />
          <Sparkles size={11} className="text-[#00f0ff]" />
          <span>{kicker}</span>
        </div>
        <button
          type="button"
          onClick={toggleMute}
          className="tutorial-quick-mute-btn"
          aria-label={isMuted ? 'Unmute tutorial video' : 'Mute tutorial video'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#00f0ff]" />}
          <span>{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
        </button>
      </div>

      {/* Center Big Play Button (when paused) */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="tutorial-center-play-btn"
          aria-label="Play tutorial video"
        >
          <div className="tutorial-play-pulse" />
          <Play size={26} className="text-white fill-white translate-x-0.5" />
        </button>
      )}

      {/* Lower Title & Tagline HUD */}
      <div className={`tutorial-info-hud ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <h3 className="tutorial-info-title">
          {title.split(' ')[0]} <span className="text-[#00f0ff]">{title.split(' ').slice(1).join(' ')}</span>
        </h3>
        <p className="tutorial-info-tagline">{tagline}</p>
      </div>

      {/* Glassmorphic Player Controls Bar */}
      <div className={`tutorial-controls-bar ${showControls || !isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'} transition-all duration-300`}>
        {/* Scrubber seek progress slider */}
        <div className="tutorial-scrub-wrap">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="tutorial-scrub-slider"
            aria-label="Seek video"
          />
          <div
            className="tutorial-scrub-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Action icons row */}
        <div className="tutorial-controls-actions">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="tutorial-ctrl-icon-btn"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} className="fill-current" />}
            </button>
            <button
              type="button"
              onClick={restartVideo}
              className="tutorial-ctrl-icon-btn"
              aria-label="Restart video"
            >
              <RotateCcw size={14} />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="tutorial-ctrl-icon-btn"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <span className="tutorial-time-text">
              {currentTime} / {duration}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="tutorial-ctrl-icon-btn"
            aria-label="Toggle fullscreen"
          >
            <Maximize size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
