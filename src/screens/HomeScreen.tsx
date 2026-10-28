import '@/styles/home/home.css';
import { Hero } from '@/sections/home/Hero';
import { Introduction } from '@/sections/home/Introduction';
import { FocusCards } from '@/sections/home/FocusCards';
import { ApproachPreview } from '@/sections/home/ApproachPreview';
import { Heritage } from '@/sections/home/Heritage';
import { Faq } from '@/sections/home/Faq';
import { PartnerCTA } from '@/sections/home/PartnerCTA';
export function HomeScreen() {
    return (
        <>
            <Hero />
            <Introduction />
            <FocusCards />
            <ApproachPreview />
            <Heritage />
            <Faq />
            <PartnerCTA />
        </>
    );
}
