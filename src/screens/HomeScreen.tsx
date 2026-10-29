//css
import '@/styles/home/home.css';
import'@/styles/home/investment-fields.css';





//components
import { Hero } from '@/sections/home/Hero';
import { InvestmentFieldsCarousel } from '@/sections/home/InvestmentFieldsCarousel';
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
            <FocusCards />
            <ApproachPreview />
            <Heritage />
            <Faq />
            <PartnerCTA />
        </>
    );
}
