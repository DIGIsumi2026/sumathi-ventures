import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/common/navigation.css';
import '@/styles/common/buttons.css';
import '@/styles/common/footer.css';
import '@/styles/common/back-to-top.css';
import '@/styles/common/inner-pages.css';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { BackToTop } from '@/components/common/BackToTop';
import { ScrollReveals } from '@/components/common/ScrollReveals';
import { PageTransition } from '@/components/common/PageTransition';

export const metadata: Metadata = {
    title: {
        default: 'Sumathi Ventures | Strategic Partnerships',
        template: '%s | Sumathi Ventures',
    },
    description:
        'Explore strategic partnerships and venture development across Industry, Commerce and Technology in Sri Lanka.',
    metadataBase: new URL('https://sumathiventures.com'),
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Manrope is a PROVISIONAL visual match; inspect Finzo computed fonts before locking typography. */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <Navbar />
                <main id="main-content">
                    <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
                <BackToTop />
                <ScrollReveals />
            </body>
        </html>
    );
}
