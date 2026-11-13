import '@/styles/about/about-hero.css';
import '@/styles/about/vision-mission.css';
import '@/styles/about/company-intro.css';
import '@/styles/about/foundation-values.css'
import '@/styles/about/about-contact.css';


import {AboutHero} from '@/sections/about/AboutHero';
import {VisionMission} from '@/sections/about/VisionMission';
import {CompanyIntro} from '@/sections/about/CompanyIntro';
import {FoundationValues} from '@/sections/about/FoundationValues';
import {AboutContactBanner} from '@/sections/about/AboutContactBanner';
export function AboutScreen() {
    return (
        <>
            <AboutHero/>
            <VisionMission/>
            <CompanyIntro />
            <FoundationValues/>
            <AboutContactBanner/>
        </>
    );
}
