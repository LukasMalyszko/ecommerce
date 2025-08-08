import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import "../css/ImageSwiper.css";

export default function ImageSwiper({
                                        images = [],
                                        initialIndex = 0,
                                        className = "",
                                        alt = "Product image",
                                    }) {
    const slides = useMemo(() => images.filter(Boolean), [images]);
    const [index, setIndex] = useState(Math.min(Math.max(initialIndex, 0), Math.max(slides.length - 1, 0)));
    const [prevIndex, setPrevIndex] = useState(null);
    const [direction, setDirection] = useState(null); // "left" (next) | "right" (prev)

    useEffect(() => {
        setIndex((i) => Math.min(Math.max(initialIndex, 0), Math.max(slides.length - 1, 0)));
    }, [initialIndex, slides.length]);

    const goTo = useCallback(
        (nextIdx) => {
            if (!slides.length) return;
            const normalized = (nextIdx + slides.length) % slides.length;
            setPrevIndex(index);
            setDirection(normalized > index || (index === slides.length - 1 && normalized === 0) ? "left" : "right");
            setIndex(normalized);
        },
        [index, slides.length]
    );

    const next = useCallback(() => goTo(index + 1), [goTo, index]);
    const prev = useCallback(() => goTo(index - 1), [goTo, index]);

    // Touch/mouse drag
    const startX = useRef(0);
    const active = useRef(false);

    const onPointerDown = (e) => {
        active.current = true;
        startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    };
    const onPointerMove = (e) => {
        if (!active.current) return;
        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    };
    const onPointerUp = (e) => {
        if (!active.current) return;
        const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
        const delta = endX - startX.current;
        active.current = false;
        const threshold = 40; // px
        if (Math.abs(delta) >= threshold) {
            delta < 0 ? next() : prev();
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
    };

    const current = slides[index];
    const previous = prevIndex !== null ? slides[prevIndex] : null;

    return (
        <div
            className={`image-swiper ${className}`}
            role="region"
            aria-label="Product image gallery"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
        >
            <div className="image-stage">
                {previous && (
                    <img
                        src={previous}
                        alt=""
                        draggable={false}
                        className={`image-slide slide-out-${direction || "left"}`}
                    />
                )}
                {current && (
                    <img
                        src={current}
                        alt={alt}
                        draggable={false}
                        className={`image-slide ${previous ? `slide-in-${direction || "left"}` : "fade-in"}`}
                        onAnimationEnd={() => {
                            setPrevIndex(null);
                            setDirection(null);
                        }}
                    />
                )}
            </div>

            {slides.length > 1 && (
                <>
                    <button
                        type="button"
                        className="nav-btn left"
                        aria-label="Previous image"
                        onClick={prev}
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        className="nav-btn right"
                        aria-label="Next image"
                        onClick={next}
                    >
                        ›
                    </button>

                    <div className="dots">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Go to image ${i + 1}`}
                                className={`dot ${i === index ? "active" : ""}`}
                                onClick={() => goTo(i)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}