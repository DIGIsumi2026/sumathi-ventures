//css
import '@/styles/home/home.css';
import'@/styles/home/investment-fields.css';
import '@/styles/home/chairman-quote.css';
import '@/styles/home/news-section.css';





//components
import { Hero } from '@/sections/home/Hero';
import { InvestmentFieldsCarousel } from '@/sections/home/InvestmentFieldsCarousel';
import {ChairmanQuote} from '@/sections/home/ChairmanQuote';
import { NewsSection } from '@/sections/home/NewsSection';
import { InvestedCompanies } from '@/sections/home/InvestedCompanies';
import { FocusCards } from '@/sections/home/FocusCards';
import { ApproachPreview } from '@/sections/home/ApproachPreview';
import { Heritage } from '@/sections/home/Heritage';
import { Faq } from '@/sections/home/Faq';
import { PartnerCTA } from '@/sections/home/PartnerCTA';
export function HomeScreen() {
    return (
        <>
            <Hero />
            <InvestmentFieldsCarousel />
            <ChairmanQuote/>
            <NewsSection />
            <InvestedCompanies />
            <FocusCards />
            <ApproachPreview />
            <Heritage />
            <Faq />
            <PartnerCTA />
        </>
    );
}
