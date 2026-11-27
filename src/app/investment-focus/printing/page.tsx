import '@/styles/investment-focus/printing/printing.css';

import { PrintingHero } from '@/sections/investment-focus/printing/PrintingHero';
import {PrintingPlatform} from '@/sections/investment-focus/printing/PrintingPlatform';
import {SumathiPrintersSection} from '@/sections/investment-focus/printing/SumathiPrintersSection';
import {NapcoSection} from '@/sections/investment-focus/printing/NapcoSection';
import {PrintingSustainability} from '@/sections/investment-focus/printing/PrintingSustainability';
export default function PrintingPage() {
  return (
    <>
      <PrintingHero />
      <PrintingPlatform />
      <SumathiPrintersSection />
      <NapcoSection/>
      <PrintingSustainability/>
    </>
  );
}