'use client';

import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { videoAssets } from '@/assets/videoAssets';

const DESKTOP_QUERY = '(min-width: 1025px) and (hover: hover) and (pointer: fine)';

export function PrintingSustainabilityVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackRequested = useRef(false);
  const [desktop, setDesktop] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const desktopMedia = window.matchMedia(DESKTOP_QUERY);
    const syncPlaybackMode = () => {
      setDesktop(desktopMedia.matches);
      if (!desktopMedia.matches) {
        video.pause();
      } else if (!playbackRequested.current) {
        void video.play().catch(() => {});
      }
    };

    syncPlaybackMode();
    desktopMedia.addEventListener('change', syncPlaybackMode);
    return () => desktopMedia.removeEventListener('change', syncPlaybackMode);
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    playbackRequested.current = true;
    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (video) video.muted = !video.muted;
  }

  function updateProgress(video: HTMLVideoElement) {
    setProgress(Number.isFinite(video.duration) && video.duration > 0
      ? (video.currentTime / video.duration) * 100
      : 0);
  }

  return (
    <div className="sv-print-sustainability__video-wrap" data-desktop={desktop}>
      <video
        ref={videoRef}
        className="sv-print-sustainability__video"
        src={videoAssets.investmentFocus.printing.napcoSustainability}
        poster="/images/investment-focus/printing/napco-sustainability-poster.webp"
        muted={muted}
        loop
        playsInline
        preload="metadata"
        aria-label="NAPCO sustainable printing and production"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onVolumeChange={event => setMuted(event.currentTarget.muted)}
        onTimeUpdate={event => updateProgress(event.currentTarget)}
        onDurationChange={event => updateProgress(event.currentTarget)}
      />

      <div className="sv-print-sustainability__video-shade" aria-hidden="true" />

      <div className="sv-print-sustainability__video-overlay">
        <p className="sv-print-sustainability__video-label">Sustainable Production</p>

        <div className="sv-print-sustainability__video-controls" role="group" aria-label="Playback controls">
          <button
            className="sv-print-sustainability__video-button"
            type="button"
            aria-label={playing ? 'Pause video' : 'Play video'}
            onClick={togglePlayback}
          >
            {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>

          {desktop && (
            <progress
              className="sv-print-sustainability__video-progress"
              aria-label="Playback progress"
              max={100}
              value={progress}
            />
          )}
        </div>

        <button
          className="sv-print-sustainability__video-button sv-print-sustainability__video-mute"
          type="button"
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          onClick={toggleMute}
        >
          {muted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
