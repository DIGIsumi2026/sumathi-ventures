import '@/styles/about/about-hero.css';
import '@/styles/about/vision-mission.css';
import '@/styles/about/company-intro.css';


import {AboutHero} from '@/sections/about/AboutHero';
import {VisionMission} from '@/sections/about/VisionMission';
import { CompanyIntro } from '@/sections/about/CompanyIntro';
export function AboutScreen() {
    return (
        <>
            <AboutHero/>
            <VisionMission/>
            <CompanyIntro />
        </>
    );
}
