'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Video,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Film,
  Eye,
  Sliders,
} from 'lucide-react';
import type { TutorialVideoConfig } from '@/app/api/tutorial-video/route';

export function TutorialVideoClient() {
  const [config, setConfig] = useState<TutorialVideoConfig>({
    videoUrl: '/tutorial-sample.mp4',
    posterUrl: '/cat-panel-ps5.jpg',
    title: 'PLAY YOUR WAY',
    kicker: '01 // TUTORIAL GUIDE',
    tagline: 'WATCH OUR STEP-BY-STEP ORDERING & REDEMPTION WALKTHROUGH.',
    autoPlay: true,
    loop: true,
    muted: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // Load existing config
  useEffect(() => {
    fetch('/api/tutorial-video')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setConfig((prev) => ({ ...prev, ...data }));
      })
      .catch((err) => {
        console.warn('Could not load tutorial video config:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle video file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setUploadProgress(40);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(85);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setConfig((prev) => ({
        ...prev,
        videoUrl: data.url,
      }));
      setUploadProgress(100);
      setTimeout(() => setUploading(false), 500);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  // Handle poster image upload
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setConfig((prev) => ({ ...prev, posterUrl: data.url }));
      }
    } catch {
      setErrorMsg('Poster upload failed');
    }
  };

  // Save config
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/tutorial-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save configuration');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb Header */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Back to Admin Dashboard
            </Link>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/30">
                <Video size={20} className="text-[#00f0ff]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Storefront Tutorial Video
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage the interactive video player embedded in the homepage &quot;Pick Your Lane&quot; section
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/#categories"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition"
            >
              <Eye size={14} /> View on Storefront <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            <CheckCircle2 size={18} />
            <span>Tutorial video successfully updated! Changes are live on the storefront homepage.</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Left Form: Settings & Upload */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Video Source Card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Film size={18} className="text-[#00f0ff]" />
                  <h2 className="text-base font-bold text-white">Video Source</h2>
                </div>

                {/* Upload Button Box */}
                <div className="mb-5 rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-5 text-center transition hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/ogg"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="video-file-input"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[#00f0ff]">
                      {uploading ? <RefreshCw size={20} className="animate-spin" /> : <Upload size={20} />}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="font-semibold text-sm text-white hover:text-[#00f0ff] transition-colors"
                      >
                        {uploading ? 'Uploading Video...' : 'Click to Upload New Tutorial Video'}
                      </button>
                      <p className="text-xs text-muted-foreground mt-1">
                        MP4, WebM, or QuickTime MOV up to 100MB
                      </p>
                    </div>
                  </div>

                  {uploading && (
                    <div className="mt-4 w-full">
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 block font-mono">
                        {uploadProgress}% Uploaded
                      </span>
                    </div>
                  )}
                </div>

                {/* Or Direct URL Input */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Or Direct Video URL (Relative or Full CDN URL)
                  </label>
                  <input
                    type="text"
                    value={config.videoUrl}
                    onChange={(e) => setConfig({ ...config, videoUrl: e.target.value })}
                    required
                    placeholder="/tutorial-sample.mp4 or https://cdn.example.com/video.mp4"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white font-mono placeholder:text-zinc-600 focus:border-[#00f0ff] focus:outline-none"
                  />
                </div>
              </div>

              {/* HUD Copy & Editorial Overlays */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-[#a855f7]" />
                  <h2 className="text-base font-bold text-white">Player HUD &amp; Editorial Copy</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Top Kicker Pill
                    </label>
                    <input
                      type="text"
                      value={config.kicker}
                      onChange={(e) => setConfig({ ...config, kicker: e.target.value })}
                      placeholder="01 // TUTORIAL GUIDE"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#00f0ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Overlay Headline
                    </label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      placeholder="PLAY YOUR WAY"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white font-bold placeholder:text-zinc-600 focus:border-[#00f0ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Sub-Headline / Tagline
                    </label>
                    <textarea
                      rows={2}
                      value={config.tagline}
                      onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                      placeholder="WATCH OUR STEP-BY-STEP ORDERING & REDEMPTION WALKTHROUGH."
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-[#00f0ff] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Poster & Playback Options */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sliders size={18} className="text-[#ec4899]" />
                  <h2 className="text-base font-bold text-white">Playback Configuration</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Poster Image URL (Thumbnail before playback)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={config.posterUrl}
                        onChange={(e) => setConfig({ ...config, posterUrl: e.target.value })}
                        placeholder="/cat-panel-ps5.jpg"
                        className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white font-mono placeholder:text-zinc-600 focus:border-[#00f0ff] focus:outline-none"
                      />
                      <input
                        ref={posterInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePosterUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => posterInputRef.current?.click()}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-3 cursor-pointer hover:border-white/20">
                      <input
                        type="checkbox"
                        checked={config.autoPlay}
                        onChange={(e) => setConfig({ ...config, autoPlay: e.target.checked })}
                        className="rounded border-zinc-700 text-primary focus:ring-0"
                      />
                      <span className="text-xs font-medium text-white">Autoplay</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-3 cursor-pointer hover:border-white/20">
                      <input
                        type="checkbox"
                        checked={config.loop}
                        onChange={(e) => setConfig({ ...config, loop: e.target.checked })}
                        className="rounded border-zinc-700 text-primary focus:ring-0"
                      />
                      <span className="text-xs font-medium text-white">Loop Video</span>
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-3 cursor-pointer hover:border-white/20">
                      <input
                        type="checkbox"
                        checked={config.muted}
                        onChange={(e) => setConfig({ ...config, muted: e.target.checked })}
                        className="rounded border-zinc-700 text-primary focus:ring-0"
                      />
                      <span className="text-xs font-medium text-white">Muted by Default</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-bold text-sm text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Save &amp; Update Homepage Video
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Live Interactive Video Player Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Eye size={15} className="text-[#00f0ff]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Live Storefront Preview
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  REAL-TIME PREVIEW
                </span>
              </div>

              <div className="relative rounded-2xl border border-white/15 bg-black overflow-hidden shadow-2xl h-[520px]">
                <video
                  ref={videoPreviewRef}
                  key={config.videoUrl}
                  src={config.videoUrl}
                  poster={config.posterUrl}
                  controls
                  className="w-full h-full object-cover"
                />

                {/* Overlaid preview badge */}
                <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center gap-2 rounded-full border border-[#00f0ff]/40 bg-black/70 px-3 py-1 text-[11px] font-mono font-bold text-white shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span>{config.kicker || '01 // TUTORIAL GUIDE'}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground text-center">
                This video player renders seamlessly in the homepage &quot;Pick Your Lane&quot; section on the left.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
