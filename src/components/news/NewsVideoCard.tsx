'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, Play, Video } from 'lucide-react';
import { formatNewsVideoDate, type NewsVideoItem } from '@/lib/newsVideos';
import {
  getYouTubeEmbedUrl,
  getYouTubeFallbackThumbnail,
  getYouTubeThumbnail,
} from '@/utils/youtube';

function VideoPreview({ video }: { video: NewsVideoItem }) {
  const [ready, setReady] = useState(false);

  return (
    <motion.iframe
      className="sv-news__preview"
      src={getYouTubeEmbedUrl(video.videoUrl, { muted: true, controls: false, loop: true })!}
      title={`${video.title} — muted preview`}
      tabIndex={-1}
      aria-hidden="true"
      allow="autoplay; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.35 }}
      onLoad={() => setReady(true)}
      data-ready={ready}
    />
  );
}

type Props = {
  video: NewsVideoItem;
  previewing: boolean;
  onPreview: (id: string) => void;
  onPreviewEnd: (id: string) => void;
  onPlay: (video: NewsVideoItem, opener: HTMLButtonElement | null) => void;
};

export function NewsVideoCard({ video, previewing, onPreview, onPreviewEnd, onPlay }: Props) {
  const button = useRef<HTMLButtonElement>(null);
  const [thumbnail, setThumbnail] = useState<'primary' | 'fallback' | 'unavailable'>('primary');
  const image =
    thumbnail === 'primary'
      ? getYouTubeThumbnail(video.videoUrl)
      : getYouTubeFallbackThumbnail(video.videoUrl);

  return (
    <article
      className="sv-news__card"
      data-cursor="READ ↗"
      onMouseEnter={() => onPreview(video.id)}
      onMouseLeave={() => onPreviewEnd(video.id)}
      onClick={() => onPlay(video, button.current)}
    >
      <button
        ref={button}
        className="sv-news__thumbnail"
        type="button"
        aria-label={`Play ${video.title}`}
        aria-haspopup="dialog"
      >
        {thumbnail !== 'unavailable' && image ? (
          <img
            src={image}
            alt={`Video thumbnail: ${video.title}`}
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => setThumbnail(thumbnail === 'primary' ? 'fallback' : 'unavailable')}
            onLoad={(event) => {
              // YouTube may return a 120px placeholder with a successful HTTP response.
              if (thumbnail === 'primary' && event.currentTarget.naturalWidth <= 120) {
                setThumbnail('fallback');
              }
            }}
          />
        ) : (
          <span className="sv-news__image-placeholder" aria-hidden="true">
            <Video size={40} />
          </span>
        )}
        {previewing && <VideoPreview video={video} />}
        <span className="sv-news__thumbnail-overlay" aria-hidden="true" />
        <span className="sv-news__play" aria-hidden="true">
          <Play fill="currentColor" size={28} />
        </span>
      </button>
      <div className="sv-news__card-content">
        <span className="sv-news__category">{video.category}</span>
        <h3 dir="auto">{video.title}</h3>
        {video.description && <p dir="auto">{video.description}</p>}
        {video.date && (
          <time className="sv-news__date" dateTime={video.date}>
            <CalendarDays size={15} aria-hidden="true" />
            {formatNewsVideoDate(video.date)}
          </time>
        )}
      </div>
    </article>
  );
}
