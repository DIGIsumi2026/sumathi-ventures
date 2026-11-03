'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { NewsVideoCard } from '@/components/news/NewsVideoCard';
import { NewsVideoModal } from '@/components/news/NewsVideoModal';
import { parseNewsVideos, type NewsVideoItem } from '@/lib/newsVideos';
import 'swiper/css';
import 'swiper/css/navigation';

export function NewsSection({ heading = 'Latest Insights' }: { heading?: string }) {
  const headingId = useId();
  const section = useRef<HTMLElement>(null);
  const previous = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const swiper = useRef<SwiperInstance | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const candidate = useRef<string | null>(null);
  const eligible = useRef(false);
  const dragging = useRef(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const modalOpen = useRef(false);
  const [nearby, setNearby] = useState(false);
  const [videos, setVideos] = useState<NewsVideoItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<NewsVideoItem | null>(null);

  const clearPreview = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    candidate.current = null;
    setPreview(null);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearby(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px' },
    );
    if (section.current) observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!nearby) return;
    const controller = new AbortController();
    setStatus('loading');
    fetch('/data/newsVideos.json', { signal: controller.signal, cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load videos.');
        return response.json();
      })
      .then((data: unknown) => {
        if (controller.signal.aborted) return;
        setVideos(parseNewsVideos(data));
        setStatus('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error');
      });
    return () => controller.abort();
  }, [nearby, retry]);

  useEffect(() => {
    const media = window.matchMedia(
      '(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    const update = () => {
      eligible.current = media.matches;
      clearPreview();
    };
    const onVisibility = () => {
      if (document.hidden) clearPreview();
    };
    update();
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      media.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', onVisibility);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [clearPreview]);

  const startPreview = useCallback(
    (id: string) => {
      clearPreview();
      if (!eligible.current || modalOpen.current || dragging.current) return;
      candidate.current = id;
      timer.current = setTimeout(() => {
        if (candidate.current === id && eligible.current && !modalOpen.current) setPreview(id);
        timer.current = null;
      }, 180);
    },
    [clearPreview],
  );

  const stopPreview = useCallback(
    (id: string) => {
      if (candidate.current === id) clearPreview();
    },
    [clearPreview],
  );

  const play = useCallback(
    (video: NewsVideoItem, button: HTMLButtonElement | null) => {
      if (swiper.current?.allowClick === false) return;
      clearPreview();
      opener.current = button;
      modalOpen.current = true;
      setSelected(video);
    },
    [clearPreview],
  );

  const close = useCallback(() => {
    modalOpen.current = false;
    setSelected(null);
  }, []);

  return (
    <section ref={section} className="sv-news" aria-labelledby={headingId}>
      <div className="sv-news__inner">
        <div className="sv-news__header">
          <div className="sv-news__intro">
            <span className="sv-news__eyebrow">Perspectives & conversations</span>
            <h2 id={headingId}>{heading}</h2>
            <p>Explore ideas, conversations and updates from Sumathi Ventures.</p>
          </div>
          <div className="sv-news__navigation" aria-label="Video carousel navigation">
            <button
              ref={previous}
              type="button"
              aria-label="Previous videos"
              disabled={videos.length === 0}
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              ref={next}
              type="button"
              aria-label="Next videos"
              disabled={videos.length === 0}
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
        {status === 'loading' && (
          <div className="sv-news__loading" role="status" aria-label="Loading videos">
            {[0, 1, 2].map((id) => (
              <div key={id} className="sv-news__skeleton" aria-hidden="true" />
            ))}
          </div>
        )}
        {status === 'error' && (
          <div className="sv-news__status" role="status">
            <p>We couldn’t load the videos. Please try again.</p>
            <button type="button" onClick={() => setRetry((value) => value + 1)}>
              Try again
            </button>
          </div>
        )}
        {status === 'ready' && videos.length === 0 && (
          <div className="sv-news__status" role="status">
            <p>No videos have been published yet.</p>
          </div>
        )}
        {status === 'ready' && videos.length > 0 && (
          <Swiper
            className="sv-news__carousel"
            data-cursor="DRAG ↔"
            data-cursor-drag
            modules={[Navigation, A11y]}
            slidesPerView={3}
            spaceBetween={24}
            speed={850}
            grabCursor
            watchOverflow
            navigation={{ prevEl: previous.current, nextEl: next.current }}
            a11y={{
              containerRoleDescriptionMessage: 'Video carousel',
              itemRoleDescriptionMessage: 'Video slide',
              prevSlideMessage: 'Previous videos',
              nextSlideMessage: 'Next videos',
            }}
            breakpoints={{
              0: { slidesPerView: 1.1, spaceBetween: 16 },
              640: { slidesPerView: 1.35, spaceBetween: 18 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1100: { slidesPerView: 3, spaceBetween: 24 },
            }}
            onBeforeInit={(instance) => {
              const navigation = instance.params.navigation;
              if (navigation && typeof navigation !== 'boolean') {
                navigation.prevEl = previous.current;
                navigation.nextEl = next.current;
              }
            }}
            onSwiper={(instance) => {
              swiper.current = instance;
            }}
            onSliderFirstMove={clearPreview}
            onTouchStart={() => {
              dragging.current = true;
              clearPreview();
            }}
            onTouchEnd={() => {
              dragging.current = false;
            }}
            onSlideChange={clearPreview}
            onBeforeResize={clearPreview}
          >
            {videos.map((video) => (
              <SwiperSlide key={video.id}>
                <NewsVideoCard
                  video={video}
                  previewing={preview === video.id}
                  onPreview={startPreview}
                  onPreviewEnd={stopPreview}
                  onPlay={play}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <NewsVideoModal video={selected} opener={opener.current} onClose={close} />
    </section>
  );
}
