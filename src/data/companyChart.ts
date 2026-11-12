import type { CandlestickData, HistogramData, UTCTimestamp } from 'lightweight-charts';

// Decorative synthetic values only: not company prices, valuations, returns or forecasts.
const closes = [
  100, 102, 101, 103, 105, 104, 106, 108, 107, 109, 110, 108, 109, 112, 114, 113, 115, 117, 116,
  115, 117, 118, 117, 120, 122, 121, 123, 124, 122, 123, 125, 127, 126, 125, 128, 130, 129, 131,
  133, 132,
];
const volumes = [
  48, 55, 42, 60, 68, 50, 58, 74, 56, 70, 64, 52, 46, 76, 82, 61, 73, 86, 65, 54, 69, 77, 62, 84,
  92, 70, 81, 89, 67, 73, 88, 96, 78, 65, 98, 104, 82, 95, 110, 91,
];

export const companyCandles: CandlestickData<UTCTimestamp>[] = closes.map((close, index) => {
  const open = index ? closes[index - 1] : 99;
  return {
    time: (1700000000 + index * 86400) as UTCTimestamp,
    open,
    high: Math.max(open, close) + 1.4 + (index % 3) * 0.4,
    low: Math.min(open, close) - 0.9 - (index % 4) * 0.2,
    close,
  };
});

export const companyVolumes: HistogramData<UTCTimestamp>[] = companyCandles.map(
  (candle, index) => ({
    time: candle.time,
    value: volumes[index],
    color: candle.close >= candle.open ? 'rgba(41,165,108,.35)' : 'rgba(191,98,90,.28)',
  }),
);
