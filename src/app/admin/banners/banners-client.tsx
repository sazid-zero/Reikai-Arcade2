'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';
import type { BannerSlide, BannersConfig } from '@/app/api/banners/route';

export function BannersClient() {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [autoPlayInterval, setAutoPlayInterval] = useState(6000);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  // Load existing banners
  useEffect(() => {
    fetch('/api/banners?all=true')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: BannersConfig | null) => {
        if (data && Array.isArray(data.slides)) {
          setSlides(data.slides);
          if (data.autoPlayInterval) setAutoPlayInterval(data.autoPlayInterval);
        }
      })
      .catch((err) => {
        console.warn('Could not load banners config:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const payload: BannersConfig = {
        autoPlayInterval,
        slides: slides.map((s, idx) => ({ ...s, order: idx })),
      };

      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save banners');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving banners');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSlide = () => {
    const newSlide: BannerSlide = {
      id: `banner-${Date.now()}`,
      title: 'New Featured Showcase',
      subtitle: 'Premium Hardware',
      description: 'Enter a compelling description highlighting product features, exclusive pricing, or warranties.',
      label: 'Featured',
      ctaText: 'Explore Now',
      ctaHref: '/games',
      imageUrl: '/covers/ps5-slim.jpg',
      active: true,
      order: slides.length,
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIdx(slides.length);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('You must have at least one banner slide.');
      return;
    }
    const updated = slides.filter((_, idx) => idx !== index);
    setSlides(updated);
    if (activeSlideIdx >= updated.length) {
      setActiveSlideIdx(Math.max(0, updated.length - 1));
    }
  };

  const handleMoveSlide = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const updated = [...slides];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setSlides(updated);
    setActiveSlideIdx(toIndex);
  };

  const handleSlideChange = (index: number, field: keyof BannerSlide, value: any) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: value };
    setSlides(updated);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, slideIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(slideIndex);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      handleSlideChange(slideIndex, 'imageUrl', data.url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload image');
    } finally {
      setUploadingIdx(null);
      if (e.target) e.target.value = '';
    }
  };

  const currentSlide = slides[activeSlideIdx] || slides[0];

  return (
    <main className="site-shell min-h-screen px-4 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#a0e4f1] hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Storefront Banner Carousel
                </h1>
                <p className="text-xs text-zinc-400">
                  Manage the luxury showcase slides displayed between the hero and vault categories.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAddSlide}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              <Plus className="w-4 h-4" /> Add Slide
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-5 py-2.5 text-xs font-bold hover:bg-zinc-200 transition shadow-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </header>

        {/* Feedback alerts */}
        {savedSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Changes saved successfully! The storefront carousel will reflect these updates immediately.
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="mt-12 text-center text-sm text-zinc-500 font-mono">Loading banners...</div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            {/* Slide Navigation Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Slides ({slides.length})
                </span>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span>Autoplay:</span>
                  <select
                    value={autoPlayInterval}
                    onChange={(e) => setAutoPlayInterval(Number(e.target.value))}
                    className="bg-zinc-900 border border-white/15 rounded px-2 py-1 text-white text-xs"
                  >
                    <option value={4000}>4s</option>
                    <option value={6000}>6s (Default)</option>
                    <option value={8000}>8s</option>
                    <option value={10000}>10s</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                {slides.map((s, idx) => {
                  const isSelected = idx === activeSlideIdx;
                  return (
                    <div
                      key={s.id || idx}
                      onClick={() => setActiveSlideIdx(idx)}
                      className={`cursor-pointer rounded-xl border p-3 transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-white/40 bg-white/10'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono text-zinc-500 w-5">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        {s.imageUrl && (
                          <div className="w-12 h-8 rounded overflow-hidden bg-black/40 border border-white/10 shrink-0">
                            <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {s.title || 'Untitled Slide'}
                          </p>
                          <p className="text-[10px] text-zinc-400 truncate">
                            {s.label || s.subtitle || 'No label'} • {s.active ? 'Active' : 'Disabled'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleMoveSlide(idx, idx - 1)}
                          disabled={idx === 0}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-20"
                          title="Move up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSlide(idx, idx + 1)}
                          disabled={idx === slides.length - 1}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-20"
                          title="Move down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(idx)}
                          className="p-1 text-zinc-500 hover:text-red-400 ml-1"
                          title="Delete slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleAddSlide}
                className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-xs text-zinc-400 hover:text-white hover:border-white/40 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Another Slide
              </button>
            </div>

            {/* Active Slide Editor */}
            {currentSlide && (
              <div className="lg:col-span-8 space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h2 className="text-base font-semibold text-white">
                      Editing Slide {activeSlideIdx + 1}: {currentSlide.title || 'Untitled'}
                    </h2>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={currentSlide.active}
                        onChange={(e) => handleSlideChange(activeSlideIdx, 'active', e.target.checked)}
                        className="rounded border-white/20 bg-zinc-900 text-white focus:ring-0"
                      />
                      <span>Active on Storefront</span>
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Kicker / Label (e.g. "Available Now", "Exclusive", "Pro Hardware")
                      </label>
                      <input
                        type="text"
                        value={currentSlide.label || ''}
                        onChange={(e) => handleSlideChange(activeSlideIdx, 'label', e.target.value)}
                        placeholder="Available Now"
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-white/40 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Subtitle (e.g. "Next-Gen Console", "Digital Vault")
                      </label>
                      <input
                        type="text"
                        value={currentSlide.subtitle || ''}
                        onChange={(e) => handleSlideChange(activeSlideIdx, 'subtitle', e.target.value)}
                        placeholder="Next-Gen Console"
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-white/40 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Main Heading (Title)
                    </label>
                    <input
                      type="text"
                      value={currentSlide.title || ''}
                      onChange={(e) => handleSlideChange(activeSlideIdx, 'title', e.target.value)}
                      placeholder="PlayStation 5 Slim"
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm font-semibold text-white placeholder-zinc-500 focus:border-white/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Description Text
                    </label>
                    <textarea
                      rows={3}
                      value={currentSlide.description || ''}
                      onChange={(e) => handleSlideChange(activeSlideIdx, 'description', e.target.value)}
                      placeholder="Short description highlighting key features..."
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-white/40 focus:outline-none"
                    />
                  </div>

                  {/* Primary CTA */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Primary Button Text
                      </label>
                      <input
                        type="text"
                        value={currentSlide.ctaText || ''}
                        onChange={(e) => handleSlideChange(activeSlideIdx, 'ctaText', e.target.value)}
                        placeholder="View Console"
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-white/40 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Primary Button Link (URL)
                      </label>
                      <input
                        type="text"
                        value={currentSlide.ctaHref || ''}
                        onChange={(e) => handleSlideChange(activeSlideIdx, 'ctaHref', e.target.value)}
                        placeholder="/games or #products"
                        className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-white/40 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Image URL & Upload */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Slide Background Image
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentSlide.imageUrl || ''}
                        onChange={(e) => handleSlideChange(activeSlideIdx, 'imageUrl', e.target.value)}
                        placeholder="/covers/ps5-slim.jpg or https://..."
                        className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-white/40 focus:outline-none"
                      />
                      <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-medium text-white hover:bg-white/15 transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingIdx === activeSlideIdx ? 'Uploading...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadImage(e, activeSlideIdx)}
                          disabled={uploadingIdx !== null}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Slide Preview Card */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <span className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      Live Preview
                    </span>
                    <div className="relative rounded-xl overflow-hidden aspect-[16/7] border border-white/15 bg-zinc-950 flex flex-col justify-end p-6">
                      {currentSlide.imageUrl && (
                        <img
                          src={currentSlide.imageUrl}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      <div className="relative z-10 space-y-1 max-w-lg">
                        {currentSlide.label && (
                          <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                            {currentSlide.label}
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {currentSlide.title || 'Slide Title'}
                        </h3>
                        <p className="text-xs text-zinc-300 line-clamp-2">
                          {currentSlide.description || 'Slide description...'}
                        </p>
                        <div className="pt-2">
                          <span className="inline-block rounded-lg bg-white text-black font-semibold text-xs px-3.5 py-1.5">
                            {currentSlide.ctaText || 'Explore'} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
