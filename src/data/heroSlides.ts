import { imageAssets } from '@/assets/imageAssets';

export type HeroSlide = {
    id: number;
    image: string;
    imageAlt: string;
    mobilePosition: string;
    mobilePresentation: 'contain' | 'cover';
    eyebrow: string;
    title: string;
    quoteLines: string[];
    shortQuoteLines: string[];
    description: string;
    primaryLabel: string;
    primaryHref: string;
};

export const HERO_AUTOPLAY_DELAY = 6500;
export const HERO_TRANSITION_SPEED = 1100;

export const heroSlides: HeroSlide[] = [
    {
        id: 1,
        image: imageAssets.hero.boardroom,
        imageAlt: 'Business partners meeting in a Sumathi Ventures boardroom overlooking Colombo.',
        mobilePosition: '69% center',
        mobilePresentation: 'contain',
        eyebrow: 'STRATEGIC VENTURES',
        title: 'Building Partnerships. Creating Lasting Value.',
        quoteLines: ['Building Partnerships.', 'Creating Lasting Value.'],
        shortQuoteLines: ['Building Partnerships.', 'Creating Lasting Value.'],
        description:
            'We connect strategic expertise, capital and market opportunities to build ventures designed for sustainable, long-term growth.',
        primaryLabel: 'Explore Our Focus',
        primaryHref: '/investment-focus/',
    },
    {
        id: 2,
        image: imageAssets.hero.renewableEnergy,
        imageAlt:
            'Renewable energy engineers inspecting solar panels and wind turbines in Sri Lanka.',
        mobilePosition: '77% center',
        mobilePresentation: 'contain',
        eyebrow: 'SUSTAINABLE INDUSTRY',
        title: 'Powering Sustainable Growth.',
        quoteLines: ['Powering', 'Sustainable Growth.'],
        shortQuoteLines: ['Powering', 'Sustainable Growth.'],
        description:
            'Advancing renewable energy, responsible industry and future-focused development through strategic investment and collaboration.',
        primaryLabel: 'Explore Industry',
        primaryHref: '/investment-focus/industry/',
    },
    {
        id: 3,
        image: imageAssets.hero.technology,
        imageAlt: 'Technology specialists collaborating at computer workstations in a data centre.',
        mobilePosition: '72% center',
        mobilePresentation: 'contain',
        eyebrow: 'TECHNOLOGY & INNOVATION',
        title: 'Technology That Moves Business Forward.',
        quoteLines: ['Technology That Moves', 'Business Forward.'],
        shortQuoteLines: ['Technology That', 'Moves Business Forward.'],
        description:
            'Supporting smarter and more secure enterprises through technology-led transformation, digital capability and strategic solutions.',
        primaryLabel: 'Explore Technology',
        primaryHref: '/investment-focus/technology/',
    },
    {
        id: 4,
        image: imageAssets.hero.agriculture,
        imageAlt: 'Agribusiness partners examining tea plants at a Sri Lankan plantation.',
        mobilePosition: '73% center',
        mobilePresentation: 'contain',
        eyebrow: 'AGRICULTURE & AGRIBUSINESS',
        title: 'Growing Opportunity From the Ground Up.',
        quoteLines: ['Growing Opportunity', 'From the Ground Up.'],
        shortQuoteLines: ['Growing Opportunity', 'From the Ground Up.'],
        description:
            'Developing agricultural value chains through responsible investment, modern practices and partnerships built for long-term value.',
        primaryLabel: 'Explore Industry',
        primaryHref: '/investment-focus/industry/',
    },
    {
        id: 5,
        image: imageAssets.hero.portLogistics,
        imageAlt:
            'Commerce and logistics partners overlooking container ships at a Sri Lankan port.',
        mobilePosition: '76% center',
        mobilePresentation: 'contain',
        eyebrow: 'COMMERCE & INFRASTRUCTURE',
        title: 'Connecting Sri Lanka to Global Commerce.',
        quoteLines: ['Connecting Sri Lanka', 'to Global Commerce.'],
        shortQuoteLines: ['Connecting Sri Lanka', 'to Global Commerce.'],
        description:
            'Creating opportunities across trade, logistics and infrastructure that connect businesses with regional and global markets.',
        primaryLabel: 'Explore Commerce',
        primaryHref: '/investment-focus/commerce/',
    },
];
