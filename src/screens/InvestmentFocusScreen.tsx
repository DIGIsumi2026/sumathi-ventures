import '@/styles/investment-focus/investment-focus-hero.css';
import '@/styles/home/home.css';
import '@/styles/investment-focus/three-pillar-foundation.css';
import '@/styles/investment-focus/investment-fields.css';
import '@/styles/investment-focus/inventment-contact.css';


import { InvestmentFocusHero } from '@/sections/investment-focus/InvestmentFocusHero';
import { FocusCards } from '@/sections/home/FocusCards';
import {ThreePillarFoundation} from '@/sections/investment-focus/ThreePillarFoundation';
import {InvestmentFields} from '@/sections/investment-focus/InvestmentFields';
import{InvestmentContactCTA} from '@/sections/investment-focus/InvestmentContactCta';
export function InvestmentFocusScreen() {
    return (
        <>
            <InvestmentFocusHero />
            <ThreePillarFoundation/>
            <InvestmentFields/>
            <InvestmentContactCTA/>
            <FocusCards />
        </>
    );
}
