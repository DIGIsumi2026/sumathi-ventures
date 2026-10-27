import '@/styles/investment-focus/focus.css';
import '@/styles/home/home.css'; // shared investment-focus card styling
import {InnerHero} from '@/components/common/InnerHero';
import {FocusCards} from '@/sections/home/FocusCards';
export function FocusScreen(){return <><InnerHero eyebrow="OUR INVESTMENT FOCUS" title="Focused on opportunity. Driven by partnership." description="Three strategic pillars connect opportunities across productive industry, commerce and technology."/><FocusCards/></>}
