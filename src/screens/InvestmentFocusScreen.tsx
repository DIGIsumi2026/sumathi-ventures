import '@/styles/investment-focus/investment-focus-hero.css';
import '@/styles/home/home.css';

import { InvestmentFocusHero } from '@/sections/investment-focus/InvestmentFocusHero';
import { FocusCards } from '@/sections/home/FocusCards';
export function InvestmentFocusScreen() {
    return (
        <>
            <InvestmentFocusHero />
            <FocusCards id="investment-fields" />
        </>
    );
}
