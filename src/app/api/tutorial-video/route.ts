import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export type TutorialVideoConfig = {
  videoUrl: string;
  posterUrl: string;
  title: string;
  kicker: string;
  tagline: string;
  autoPlay: boolean;
  loop: boolean;
  muted: boolean;
  updatedAt?: string;
};

const DEFAULT_CONFIG: TutorialVideoConfig = {
  videoUrl: '/tutorial-sample.mp4',
  posterUrl: '/cat-panel-ps5.jpg',
  title: 'PLAY YOUR WAY',
  kicker: '01 // TUTORIAL GUIDE',
  tagline: 'WATCH OUR STEP-BY-STEP ORDERING & REDEMPTION WALKTHROUGH.',
  autoPlay: true,
  loop: true,
  muted: true,
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'tutorial-video.json');

async function getStoredConfig(): Promise<TutorialVideoConfig> {
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function GET() {
  const config = await getStoredConfig();
  return NextResponse.json(config);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = await getStoredConfig();

    const updated: TutorialVideoConfig = {
      videoUrl: typeof body.videoUrl === 'string' && body.videoUrl.trim() ? body.videoUrl.trim() : current.videoUrl,
      posterUrl: typeof body.posterUrl === 'string' && body.posterUrl.trim() ? body.posterUrl.trim() : current.posterUrl,
      title: typeof body.title === 'string' && body.title.trim() ? body.title.trim() : current.title,
      kicker: typeof body.kicker === 'string' && body.kicker.trim() ? body.kicker.trim() : current.kicker,
      tagline: typeof body.tagline === 'string' ? body.tagline.trim() : current.tagline,
      autoPlay: typeof body.autoPlay === 'boolean' ? body.autoPlay : current.autoPlay,
      loop: typeof body.loop === 'boolean' ? body.loop : current.loop,
      muted: typeof body.muted === 'boolean' ? body.muted : current.muted,
      updatedAt: new Date().toISOString(),
    };

    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(updated, null, 2), 'utf8');

    return NextResponse.json({ success: true, config: updated });
  } catch (err) {
    console.error('Failed to update tutorial video config:', err);
    return NextResponse.json({ error: 'Failed to update tutorial video settings' }, { status: 500 });
  }
}
