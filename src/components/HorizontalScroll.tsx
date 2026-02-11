'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface HorizontalScrollProps {
    children: React.ReactNode;
}

export function HorizontalScroll({ children }: HorizontalScrollProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollRange, setScrollRange] = useState(0);
    const [viewportW, setViewportW] = useState(0);

    useEffect(() => {
        if (scrollRef.current) {
            setScrollRange(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
            setViewportW(scrollRef.current.clientWidth);
        }
    }, [children]);

    // Hook into native scroll for momentum but limit to horizontal
    // Actually, for "Linear" feel, we might want a custom drag implementation or just standard horizontal scroll with CSS snap.
    // Let's stick to native horizontal scroll with class "overflow-x-auto" for best performance and accessibility,
    // but wrap it to look nice.

    return (
        <div
            ref={scrollRef}
            className="flex overflow-x-auto h-screen items-center px-[10vw] sm:px-[25vw] md:px-[50vw] snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x"
        >
            <div className="flex gap-4 sm:gap-8 md:gap-12 lg:gap-16 py-10 sm:py-20">
                {children}
            </div>
        </div>
    );
}
