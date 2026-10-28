'use client';

import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import gsap from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { heroSlides, HERO_AUTOPLAY_DELAY, HERO_TRANSITION_SPEED } from '@/data/heroSlides';
import 'swiper/css';
import 'swiper/css/effect-fade';
import '@/styles/home/hero.css';

export function Hero() {
    const root = useRef<HTMLElement>(null);
    const content = useRef<HTMLDivElement>(null);
    const previousButton = useRef<HTMLButtonElement>(null);
    const nextButton = useRef<HTMLButtonElement>(null);
    const pagination = useRef<HTMLDivElement>(null);
    const firstImage = useRef<HTMLImageElement>(null);
    const reveal = useRef<gsap.core.Tween | null>(null);
    const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageReady, setImageReady] = useState(false);
    const [inView, setInView] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [compact, setCompact] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [focused, setFocused] = useState(false);
    const [pageHidden, setPageHidden] = useState(false);
    const shouldPause = focused || pageHidden || !inView;
    const pauseRequested = useRef(true);
    pauseRequested.current = shouldPause || reducedMotion || !hasStarted;

    useEffect(() => {
        const viewport = window.matchMedia('(max-width: 900px)');
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updateViewport = () => setCompact(viewport.matches);
        const updateMotion = () => setReducedMotion(motion.matches);
        const updateVisibility = () => setPageHidden(document.hidden);
        updateViewport();
        updateMotion();
        updateVisibility();
        viewport.addEventListener('change', updateViewport);
        motion.addEventListener('change', updateMotion);
        document.addEventListener('visibilitychange', updateVisibility);

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.15),
            { threshold: 0.15 },
        );
        if (root.current) observer.observe(root.current);
        if (firstImage.current?.complete) setImageReady(true);

        return () => {
            viewport.removeEventListener('change', updateViewport);
            motion.removeEventListener('change', updateMotion);
            document.removeEventListener('visibilitychange', updateVisibility);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (swiper && imageReady && inView) setHasStarted(true);
    }, [swiper, imageReady, inView]);

    useEffect(() => {
        if (!swiper || swiper.destroyed) return;
        if (!hasStarted || reducedMotion) {
            swiper.autoplay.stop();
            return;
        }
        if (!swiper.autoplay.running) swiper.autoplay.start();
        if (shouldPause && !swiper.autoplay.paused) swiper.autoplay.pause();
        if (!shouldPause && swiper.autoplay.paused && !swiper.animating) swiper.autoplay.resume();
    }, [swiper, hasStarted, reducedMotion, shouldPause]);

    useLayoutEffect(() => {
        if (!hasStarted || !content.current) return;
        const copy = content.current.querySelector<HTMLElement>(
            `[data-hero-copy="${activeIndex}"]`,
        );
        if (!copy) return;
        const context = gsap.context(() => {
            const lines = copy.querySelectorAll<HTMLElement>('.sv-hero-carousel__quote-line');
            if (reducedMotion) {
                gsap.set(lines, { clipPath: 'inset(0 0% 0 0)' });
            } else {
                reveal.current = gsap.fromTo(
                    lines,
                    { clipPath: 'inset(0 100% 0 0)' },
                    {
                        clipPath: 'inset(0 0% 0 0)',
                        duration: 3.25,
                        stagger: 0.45,
                        ease: 'power4.out',
                        delay: 1.28,
                    },
                );
            }
        }, copy);
        return () => {
            context.revert();
            reveal.current = null;
        };
    }, [activeIndex, compact, hasStarted, reducedMotion]);

    useEffect(() => {
        reveal.current?.paused(pageHidden || !inView);
    }, [pageHidden, inView, activeIndex, compact, hasStarted]);

    const freezeOutgoingImage = (instance: SwiperInstance) => {
        const image = instance.slides[instance.activeIndex]?.querySelector('img');
        if (!image) return;
        // Preserve the outgoing zoom while Swiper fades it away.
        const style = window.getComputedStyle(image);
        image.style.transform = style.transform;
        image.style.opacity = style.opacity;
    };

    const changeSlide = (instance: SwiperInstance) => {
        reveal.current?.kill();
        root.current?.style.setProperty('--sv-hero-progress', '0');
        const image = instance.slides[instance.activeIndex]?.querySelector('img');
        image?.style.removeProperty('transform');
        image?.style.removeProperty('opacity');
        setActiveIndex(instance.realIndex);
    };

    const finishTransition = (instance: SwiperInstance) => {
        const image = instance.slides[instance.activeIndex]?.querySelector('img');
        if (image?.complete && image.naturalWidth) {
            root.current?.style.setProperty('--sv-hero-backdrop', `url("${image.currentSrc}")`);
        }
        if (pauseRequested.current && instance.autoplay.running && !instance.autoplay.paused) {
            instance.autoplay.pause();
        }
    };

    return (
        <section
            ref={root}
            className="sv-hero sv-hero-carousel"
            id="top"
            aria-label="Sumathi Ventures"
            aria-roledescription="carousel"
            data-ready={hasStarted}
            data-motion-paused={pageHidden || !inView}
            style={{ '--sv-hero-backdrop': `url("${heroSlides[0].image}")` } as CSSProperties}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
            }}
        >
            <div className="sv-hero-carousel__media">
                <Swiper
                    className="sv-hero-carousel__swiper"
                    modules={[Autoplay, EffectFade, Navigation, Pagination, A11y]}
                    slidesPerView={1}
                    loop={heroSlides.length > 1}
                    effect="fade"
                    speed={reducedMotion ? 0 : HERO_TRANSITION_SPEED}
                    allowTouchMove={true}
                    loopPreventsSliding={false}
                    fadeEffect={{ crossFade: true }}
                    autoplay={{
                        delay: HERO_AUTOPLAY_DELAY,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: false,
                    }}
                    lazyPreloadPrevNext={1}
                    navigation={{ prevEl: previousButton.current, nextEl: nextButton.current }}
                    pagination={{
                        el: pagination.current,
                        clickable: true,
                        renderBullet: (index, className) =>
                            `<button type="button" class="${className}" aria-label="Show hero slide ${index + 1}"><span class="sv-hero-carousel__progress" aria-hidden="true"></span></button>`,
                    }}
                    a11y={{
                        prevSlideMessage: 'Previous slide',
                        nextSlideMessage: 'Next slide',
                        paginationBulletMessage: 'Show hero slide {{index}}',
                        scrollOnFocus: false,
                    }}
                    onBeforeInit={(instance) => {
                        if (typeof instance.params.navigation === 'object') {
                            instance.params.navigation.prevEl = previousButton.current;
                            instance.params.navigation.nextEl = nextButton.current;
                        }
                        if (typeof instance.params.pagination === 'object') {
                            instance.params.pagination.el = pagination.current;
                        }
                    }}
                    onInit={(instance) => {
                        instance.autoplay.stop();
                        setSwiper(instance);
                    }}
                    onBeforeSlideChangeStart={freezeOutgoingImage}
                    onSlideChangeTransitionStart={changeSlide}
                    onSlideChangeTransitionEnd={finishTransition}
                    onAutoplayTimeLeft={(instance, _, remaining) => {
                        root.current?.style.setProperty(
                            '--sv-hero-progress',
                            String(
                                instance.animating ? 0 : Math.max(0, Math.min(1, 1 - remaining)),
                            ),
                        );
                    }}
                    onAutoplayResume={(instance) => {
                        if (pauseRequested.current) instance.autoplay.pause();
                    }}
                >
                    {heroSlides.map((slide, index) => (
                        <SwiperSlide
                            key={slide.id}
                            data-mobile-presentation={slide.mobilePresentation}
                            style={
                                {
                                    '--sv-hero-slide-image': `url("${slide.image}")`,
                                    '--sv-hero-mobile-position': slide.mobilePosition,
                                } as CSSProperties
                            }
                        >
                            <div className="sv-hero-carousel__mobile-backdrop" aria-hidden="true" />
                            <img
                                ref={index === 0 ? firstImage : undefined}
                                src={slide.image}
                                alt={slide.imageAlt}
                                className="sv-hero-carousel__image"
                                loading={index === 0 ? 'eager' : 'lazy'}
                                fetchPriority={index === 0 ? 'high' : 'low'}
                                decoding="async"
                                draggable={false}
                                onLoad={index === 0 ? () => setImageReady(true) : undefined}
                                onError={index === 0 ? () => setImageReady(true) : undefined}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="sv-hero-carousel__overlay" aria-hidden="true" />
            <div
                ref={content}
                className="container sv-hero-carousel__content"
                aria-live={shouldPause ? 'polite' : 'off'}
            >
                {heroSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className="sv-hero-carousel__copy"
                        data-hero-copy={index}
                        hidden={index !== activeIndex}
                        inert={index !== activeIndex}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} of ${heroSlides.length}`}
                    >
                        <p className="sv-hero-carousel__eyebrow">{slide.eyebrow}</p>
                        <div className="sv-hero-carousel__title-mask">
                            <h1 aria-label={slide.title}>
                                {(compact ? slide.shortQuoteLines : slide.quoteLines).map(
                                    (line, lineIndex) => (
                                        <span
                                            className="sv-hero-carousel__line-mask"
                                            key={lineIndex}
                                            aria-hidden="true"
                                        >
                                            <span className="sv-hero-carousel__quote-line">
                                                {line}
                                            </span>
                                        </span>
                                    ),
                                )}
                            </h1>
                        </div>
                        <p className="sv-hero-carousel__description">{slide.description}</p>
                        <div className="sv-hero-carousel__actions">
                            <AnimatedButton href={slide.primaryHref}>
                                {slide.primaryLabel}
                            </AnimatedButton>
                            <Link href="/contact/" className="sv-hero-carousel__secondary">
                                <span>Partner With Us</span>
                                <ArrowUpRight size={18} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="container sv-hero-carousel__footer">
                <div
                    ref={pagination}
                    className="sv-hero-carousel__pagination"
                    aria-label="Hero slides"
                />
                <div className="sv-hero-carousel__navigation">
                    <button ref={previousButton} type="button" aria-label="Previous slide">
                        <ArrowLeft size={18} />
                    </button>
                    <button ref={nextButton} type="button" aria-label="Next slide">
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
