'use client';

import { useEffect, useRef } from 'react';
import { companyCandles, companyVolumes } from '@/data/companyChart';

// TradingView Lightweight Charts™
// Copyright (с) 2025 TradingView, Inc. https://www.tradingview.com/
// Attribution link is rendered in the site footer, outside this decorative layer.
export function MarketChartBackground() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    const section = element?.closest('section');
    if (!element || !section) return;
    let disposed = false;
    let started = false;
    let inView = false;
    let cleanupChart: (() => void) | undefined;
    let updatePlayback = () => {};

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        near.disconnect();
        void import('lightweight-charts')
          .then(({ createChart, CandlestickSeries, HistogramSeries, ColorType, CrosshairMode }) => {
            if (disposed) return;
            const chart = createChart(element, {
              width: element.clientWidth,
              height: element.clientHeight,
              layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'transparent',
                attributionLogo: false,
              },
              grid: {
                vertLines: { visible: false },
                horzLines: { color: 'rgba(255,255,255,.055)' },
              },
              leftPriceScale: { visible: false },
              rightPriceScale: {
                visible: false,
                borderVisible: false,
                scaleMargins: { top: 0.12, bottom: 0.25 },
              },
              timeScale: { visible: false, borderVisible: false, shiftVisibleRangeOnNewBar: false },
              crosshair: { mode: CrosshairMode.Hidden },
              handleScroll: false,
              handleScale: false,
              kineticScroll: { mouse: false, touch: false },
            });
            const candles = chart.addSeries(CandlestickSeries, {
              upColor: '#29a56c',
              downColor: '#bf625a',
              borderVisible: false,
              wickUpColor: '#29a56c',
              wickDownColor: '#bf625a',
              lastValueVisible: false,
              priceLineVisible: false,
              autoscaleInfoProvider: () => ({ priceRange: { minValue: 96, maxValue: 138 } }),
            });
            const volume = chart.addSeries(HistogramSeries, {
              priceScaleId: 'volume',
              lastValueVisible: false,
              priceLineVisible: false,
            });
            volume
              .priceScale()
              .applyOptions({ scaleMargins: { top: 0.8, bottom: 0 }, visible: false });
            const guide = candles.createPriceLine({
              price: companyCandles[0].close,
              color: 'rgba(186,241,156,.22)',
              lineWidth: 1,
              lineStyle: 2,
              axisLabelVisible: false,
            });
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
            let index = 0;
            let phase: 'play' | 'hold' | 'reset' = 'play';
            let timer: ReturnType<typeof setTimeout> | undefined;
            let isStatic = reduced.matches || element.clientWidth <= 360;

            const range = () => {
              const count = element.clientWidth <= 700 ? 18 : companyCandles.length;
              const end = Math.max(count - 1, index - 1);
              chart.timeScale().setVisibleLogicalRange({ from: end - count + 0.5, to: end + 0.5 });
            };
            const publish = () => {
              element.dataset.pointCount = String(candles.data().length);
              guide.applyOptions({ price: companyCandles[Math.max(0, index - 1)].close });
              range();
            };
            const reset = () => {
              index = isStatic ? companyCandles.length : 3;
              candles.setData(companyCandles.slice(0, index));
              volume.setData(companyVolumes.slice(0, index));
              phase = 'play';
              element.dataset.resetting = 'false';
              publish();
            };
            const schedule = () => {
              if (timer || disposed || isStatic || !inView || document.hidden) return;
              timer = setTimeout(tick, phase === 'hold' ? 1400 : phase === 'reset' ? 300 : 400);
            };
            const tick = () => {
              timer = undefined;
              if (disposed || isStatic || !inView || document.hidden) return;
              if (phase === 'reset') reset();
              else if (phase === 'hold') {
                element.dataset.resetting = 'true';
                phase = 'reset';
              } else {
                candles.update(companyCandles[index]);
                volume.update(companyVolumes[index]);
                index++;
                publish();
                if (index === companyCandles.length) phase = 'hold';
              }
              schedule();
            };
            updatePlayback = () => {
              clearTimeout(timer);
              timer = undefined;
              element.dataset.playback = isStatic
                ? 'static'
                : inView && !document.hidden
                  ? 'playing'
                  : 'paused';
              schedule();
            };
            reset();
            updatePlayback();
            const resize = new ResizeObserver(() => {
              chart.applyOptions({ width: element.clientWidth, height: element.clientHeight });
              const nextStatic = reduced.matches || element.clientWidth <= 360;
              if (nextStatic !== isStatic) {
                isStatic = nextStatic;
                reset();
                updatePlayback();
              } else range();
            });
            const onMotion = () => {
              isStatic = reduced.matches || element.clientWidth <= 360;
              reset();
              updatePlayback();
            };
            resize.observe(element);
            reduced.addEventListener('change', onMotion);
            document.addEventListener('visibilitychange', updatePlayback);
            element.dataset.ready = 'true';
            cleanupChart = () => {
              clearTimeout(timer);
              resize.disconnect();
              reduced.removeEventListener('change', onMotion);
              document.removeEventListener('visibilitychange', updatePlayback);
              chart.remove();
            };
          })
          .catch(() => {
            if (!disposed) element.dataset.ready = 'false';
          });
      },
      { rootMargin: '300px' },
    );
    const visible = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0.02 },
    );
    near.observe(section);
    visible.observe(section);
    return () => {
      disposed = true;
      near.disconnect();
      visible.disconnect();
      cleanupChart?.();
    };
  }, []);

  return <div ref={root} className="sv-market-chart" aria-hidden="true" />;
}
