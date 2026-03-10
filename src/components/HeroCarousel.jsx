import { useState, useEffect, useRef, useCallback } from 'react';

const CAROUSEL_SLIDES = [
    {
        /* ── CAROUSEL IMAGE 1 ── (public/carousel/slide-1.png) */
        src: '/carousel/slide-1.png',
        alt: 'MediVault — Slide 1',
    },
    {
        /* ── CAROUSEL IMAGE 2 ── (public/carousel/slide-2.png) */
        src: '/carousel/slide-2.png',
        alt: 'MediVault — Slide 2',
    },
    {
        /* ── CAROUSEL IMAGE 3 ── (public/carousel/slide-3.png) */
        src: '/carousel/slide-3.png',
        alt: 'MediVault — Slide 3',
    },
    {
        /* ── CAROUSEL IMAGE 4 ── (public/carousel/slide-4.png) */
        src: '/carousel/slide-4.png',
        alt: 'MediVault — Slide 4',
    },
];


export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);

    const goTo = useCallback((index) => {
        setCurrent(() => {
            const next = ((index % CAROUSEL_SLIDES.length) + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
            return next;
        });
    }, []);

    const startAutoplay = useCallback(() => {
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
        }, 4000);
    }, []);

    const stopAutoplay = useCallback(() => {
        clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        startAutoplay();
        return () => stopAutoplay();
    }, [startAutoplay, stopAutoplay]);

    return (
        <div
            className="hero-carousel"
            onMouseEnter={stopAutoplay}
            onMouseLeave={startAutoplay}
        >
            <div className="carousel-track">
                {CAROUSEL_SLIDES.map((slide, i) => (
                    <div key={i} className={`carousel-slide${i === current ? ' active' : ''}`}>
                        <img src={slide.src} alt={slide.alt} loading="lazy" />
                        <div className="slide-caption">{slide.alt}</div>
                    </div>
                ))}
            </div>
            <div className="carousel-dots">
                {CAROUSEL_SLIDES.map((_, i) => (
                    <button
                        key={i}
                        className={`dot${i === current ? ' active' : ''}`}
                        aria-label={`Slide ${i + 1}`}
                        onClick={() => {
                            stopAutoplay();
                            goTo(i);
                            startAutoplay();
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
