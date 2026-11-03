import { getYouTubeVideoId } from '@/utils/youtube';

export type NewsVideoItem = {
  id: string;
  videoUrl: string;
  category: string;
  title: string;
  description: string;
  date: string;
};

export function parseNewsVideos(value: unknown): NewsVideoItem[] {
  if (!Array.isArray(value)) throw new Error('Video data must be an array.');
  const videoIds = new Set<string>();
  const ids = new Set<string>();
  const videos: NewsVideoItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error('Each video must be an object.');
    }
    const read = (key: string) => {
      const field = (entry as Record<string, unknown>)[key];
      if (field === undefined || field === null) return '';
      if (typeof field !== 'string') throw new Error(`${key} must be text.`);
      return field.trim();
    };
    const videoUrl = read('videoUrl');
    // The editable blank entry is a template, not a published video.
    if (!videoUrl) continue;
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) throw new Error('A video URL is not a valid YouTube link.');
    if (videoIds.has(videoId)) continue;
    const date = read('date');
    if (
      date &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) ||
        new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date)
    ) {
      throw new Error('Video dates must use YYYY-MM-DD.');
    }
    let id = read('id') || videoId;
    if (ids.has(id)) id = `${id}-${videoId}`;
    videos.push({
      id,
      videoUrl,
      category: read('category') || 'Insights',
      title: read('title') || 'Watch video',
      description: read('description'),
      date,
    });
    videoIds.add(videoId);
    ids.add(id);
  }
  return videos;
}

export function formatNewsVideoDate(date: string): string {
  return date
    ? new Intl.DateTimeFormat('en', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(`${date}T00:00:00Z`))
    : '';
}
