const VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

export function getYouTubeVideoId(value: string): string | null {
  const input = value.trim();
  if (VIDEO_ID.test(input)) return input;
  try {
    const url = new URL(input);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    const parts = url.pathname.split('/').filter(Boolean);
    let id: string | null = null;
    if (['youtu.be', 'www.youtu.be'].includes(url.hostname)) {
      id = parts[0] || null;
    } else if (YOUTUBE_HOSTS.has(url.hostname)) {
      if (parts[0] === 'watch') id = url.searchParams.get('v');
      if (['shorts', 'embed', 'live'].includes(parts[0])) id = parts[1] || null;
    }
    return id && VIDEO_ID.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function getYouTubeThumbnail(value: string): string | null {
  const id = getYouTubeVideoId(value);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

export function getYouTubeFallbackThumbnail(value: string): string | null {
  const id = getYouTubeVideoId(value);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

type EmbedOptions = {
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
};

export function getYouTubeEmbedUrl(value: string, options: EmbedOptions = {}): string | null {
  const id = getYouTubeVideoId(value);
  if (!id) return null;
  const url = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
  url.searchParams.set('autoplay', options.autoplay === false ? '0' : '1');
  url.searchParams.set('mute', options.muted ? '1' : '0');
  url.searchParams.set('controls', options.controls === false ? '0' : '1');
  url.searchParams.set('playsinline', '1');
  url.searchParams.set('rel', '0');
  if (options.loop) {
    url.searchParams.set('loop', '1');
    url.searchParams.set('playlist', id);
  }
  if (options.controls === false) {
    url.searchParams.set('disablekb', '1');
    url.searchParams.set('fs', '0');
  }
  return url.toString();
}
