import '@/styles/investment-focus/investment-focus-hero.css';
import '@/styles/home/home.css';
import '@/styles/investment-focus/three-pillar-foundation.css';

import { InvestmentFocusHero } from '@/sections/investment-focus/InvestmentFocusHero';
import { FocusCards } from '@/sections/home/FocusCards';
import {ThreePillarFoundation} from '@/sections/investment-focus/ThreePillarFoundation';
export function InvestmentFocusScreen() {
    return (
        <>
            <InvestmentFocusHero />
            <ThreePillarFoundation/>
            <FocusCards id="investment-fields" />
        </>
    );
}
