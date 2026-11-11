import '@/styles/about/about-hero.css';
import '@/styles/about/vision-mission.css';


import {AboutHero} from '@/sections/about/AboutHero';
import {VisionMission} from '@/sections/about/VisionMission';
export function AboutScreen() {
    return (
        <>
            <AboutHero/>
            <VisionMission/>
        </>
    );
}
