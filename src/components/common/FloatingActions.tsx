'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BackToTop } from '@/components/common/BackToTop';
import { WhatsAppFloating } from '@/components/common/WhatsAppFloating';

export function FloatingActions() {
  const pathname = usePathname();
  const [visibility, setVisibility] = useState({ pathname, shown: false });
  const shown = visibility.pathname === pathname && visibility.shown;

  useEffect(() => {
    const main = document.getElementById('main-content');
    if (!main) return;
    let hero: HTMLElement | null = null;
    const update = () => {
      const nextShown = Boolean(
        hero?.isConnected && hero.getBoundingClientRect().bottom <= 0 && window.scrollY > 0,
      );
      setVisibility(previous =>
        previous.pathname === pathname && previous.shown === nextShown
          ? previous
          : { pathname, shown: nextShown },
      );
    };
    const intersection = new IntersectionObserver(update);
    const resize = new ResizeObserver(update);
    const bindHero = () => {
      if (hero?.isConnected) return;
      intersection.disconnect();
      resize.disconnect();
      hero = main.querySelector<HTMLElement>('[data-page-hero]');
      if (hero) {
        intersection.observe(hero);
        resize.observe(hero);
      }
      update();
    };
    // App Router can mount the next page after the pathname changes.
    const mutations = new MutationObserver(bindHero);
    mutations.observe(main, { childList: true, subtree: true });
    bindHero();
    window.addEventListener('pageshow', update);
    return () => {
      intersection.disconnect();
      resize.disconnect();
      mutations.disconnect();
      window.removeEventListener('pageshow', update);
    };
  }, [pathname]);

  return (
    <>
      <WhatsAppFloating shown={shown} />
      <BackToTop shown={shown} />
    </>
  );
}
