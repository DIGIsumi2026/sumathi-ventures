'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import type { NewsVideoItem } from '@/lib/newsVideos';
import { getYouTubeEmbedUrl } from '@/utils/youtube';

type Props = {
  video: NewsVideoItem | null;
  opener: HTMLElement | null;
  onClose: () => void;
};

function VideoDialog({
  video,
  opener,
  onClose,
  portal,
}: Props & { video: NewsVideoItem; portal: HTMLElement }) {
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const present = useIsPresent();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!present) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const siblings = Array.from(document.body.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== portal,
    );
    const inert = siblings.map((element) => element.inert);
    siblings.forEach((element) => {
      element.inert = true;
    });
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    close.current?.focus({ preventScroll: true });

    const focusables = () =>
      Array.from(
        dialog.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), iframe, a[href], [tabindex="0"]',
        ) || [],
      );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (!dialog.current?.contains(event.target as Node)) close.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocus);
      siblings.forEach((element, index) => {
        element.inert = inert[index];
      });
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [present, portal, opener, onClose]);

  return (
    <motion.div
      className="sv-news-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
      style={{ pointerEvents: present ? 'auto' : 'none' }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialog}
        className="sv-news-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 26, scale: reduceMotion ? 1 : 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.98 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          ref={close}
          className="sv-news-modal__close"
          type="button"
          aria-label="Close video"
          onClick={onClose}
        >
          <X size={22} aria-hidden="true" />
        </button>
        <div className="sv-news-modal__player">
          {present && (
            <iframe
              src={getYouTubeEmbedUrl(video.videoUrl)!}
              title={video.title}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>
        <div className="sv-news-modal__content">
          <span className="sv-news__category">{video.category}</span>
          <h3 id={titleId} dir="auto">
            {video.title}
          </h3>
          {video.description && <p dir="auto">{video.description}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function NewsVideoModal({ video, opener, onClose }: Props) {
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    const element = document.createElement('div');
    element.className = 'sv-news-modal-root';
    document.body.appendChild(element);
    setPortal(element);
    return () => element.remove();
  }, []);

  return portal
    ? createPortal(
        <AnimatePresence>
          {video && (
            <VideoDialog
              key={video.id}
              video={video}
              opener={opener}
              onClose={onClose}
              portal={portal}
            />
          )}
        </AnimatePresence>,
        portal,
      )
    : null;
}
