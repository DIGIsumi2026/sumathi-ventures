export const site = {
    company: 'Sumathi Ventures',
    location: 'No. 758, Baseline Road, Colombo 09, Sri Lanka',
    email: 'info@sumathiventures.com',
    phone: '+94 11 269 7106',
    links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about/' },
        { label: 'Investment Focus', href: '/investment-focus/' },
        { label: 'Our Approach', href: '/approach/' },
        { label: 'Ventures', href: '/ventures/' },
        { label: 'Insights', href: '/insights/' },
    ],
} as const;
export const sectors = [
    {
        number: '01',
        slug: 'industry',
        title: 'Industry',
        kicker: 'ADVANCING PRODUCTIVE INDUSTRIES',
        summary: 'Renewable energy, agriculture, manufacturing and light engineering.',
        tags: ['Renewable Energy', 'Agriculture', 'Manufacturing'],
    },
    {
        number: '02',
        slug: 'commerce',
        title: 'Commerce',
        kicker: 'CONNECTING COMMERCIAL OPPORTUNITIES',
        summary:
            'Financial intermediary services, real estate, infrastructure and project facilitation.',
        tags: ['Infrastructure', 'Real Estate', 'Facilitation'],
    },
    {
        number: '03',
        slug: 'technology',
        title: 'Technology',
        kicker: 'ENABLING PROGRESS',
        summary:
            'Digital security printing, enterprise solutions and technology-enabled processes.',
        tags: ['Digital Solutions', 'Security Printing', 'Enterprise Technology'],
    },
] as const;
