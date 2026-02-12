'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { EventItem, DayEntry } from '@/lib/api';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, X } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface EventFocusViewProps {
    day: DayEntry;
}

export function EventFocusView({ day }: EventFocusViewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile/touch device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const currentEvent = day.events[currentIndex];
    // Calculate a mock "progress" color or mood based on default or some logic
    // For now simple accent color

    const paginate = (newDirection: number) => {
        const nextIndex = currentIndex + newDirection;
        if (nextIndex >= 0 && nextIndex < day.events.length) {
            setDirection(newDirection);
            setCurrentIndex(nextIndex);
        }
    };

    // Swipe gesture handling
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
        if (isMobile) {
            // Vertical swipe on mobile: swipe up = next, swipe down = previous
            const swipe = swipePower(offset.y, velocity.y);
            if (swipe < -swipeConfidenceThreshold) {
                paginate(1);  // swipe up → next
            } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1); // swipe down → previous
            }
        } else {
            // Horizontal swipe on desktop
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
            }
        }
    };

    // Touch swipe on entire page (mobile only)
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    useEffect(() => {
        if (!isMobile) return;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };
        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStartRef.current || !e.changedTouches[0]) return;
            const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
            const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
            // Only trigger if vertical swipe is dominant and distance > 60px
            if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) {
                if (dy < 0) paginate(1);   // swipe up → next
                else paginate(-1);          // swipe down → previous
            }
            touchStartRef.current = null;
        };
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isMobile, currentIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') paginate(1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') paginate(-1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]);

    const variants = {
        enter: (direction: number) => (isMobile ? {
            y: direction > 0 ? 600 : -600,
            opacity: 0,
            scale: 0.95
        } : {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => (isMobile ? {
            zIndex: 0,
            y: direction < 0 ? 600 : -600,
            opacity: 0,
            scale: 0.95
        } : {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        })
    };

    // Parse date for calendar anchor
    const [month, dateStr] = day.date.split('-'); // day.date format is "MM-DD" e.g. "01-08"

    // Format date in Chinese: "01-08" → "1月8日"
    const formattedDateCN = `${parseInt(month)}月${parseInt(dateStr)}日`;

    return (
        <div className="h-[100dvh] w-full relative overflow-hidden flex flex-col pt-16 sm:pt-20 md:pt-24 bg-slate-950">

            {/* Ambient Background - Dynamic based on index maybe? */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 to-black transition-colors duration-1000`} />
                {/* Desktop: blur glow. Mobile: lightweight radial gradient */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full hidden md:block bg-amber-500/10 blur-[120px] animate-pulse" />
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full md:hidden bg-[radial-gradient(circle,_rgba(245,158,11,0.1)_0%,_transparent_70%)] mobile-ambient" />
            </div>

            {/* Navigation / Close */}
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-50 flex justify-between items-start">
                <Link href="/" className="glass-surface p-3 rounded-full text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </Link>

                {/* Calendar Anchor */}
                <div className="flex flex-col items-end gap-2">
                    <div className="glass-surface p-1 rounded-xl border border-white/10 flex flex-col items-center w-20 shadow-2xl backdrop-blur-md bg-slate-900/80">
                        <div className="w-full bg-slate-800/50 rounded-t-lg py-1 text-center border-b border-white/5">
                            <span className="text-xs font-mono text-amber-500 font-bold uppercase tracking-widest">{month}月</span>
                        </div>
                        <div className="py-2">
                            <span className="text-3xl font-serif font-bold text-white">{dateStr}</span>
                        </div>
                    </div>
                    <div className="text-xs font-mono text-slate-500 tracking-widest pr-1">
                        {currentIndex + 1} / {day.events.length}
                    </div>
                </div>
            </div>

            {/* Main Slider Area - Adjusted to accommodate Summary */}
            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex-1 flex flex-col justify-center min-h-0 pb-12">

                {/* Persistent Day Summary */}
                {day.intro && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 glass-surface p-4 sm:p-5 md:p-6 rounded-xl text-slate-300 font-serif leading-loose text-center shadow-lg backdrop-blur-md"
                    >
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{day.intro}</ReactMarkdown>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            y: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag={isMobile ? "y" : "x"}
                        dragConstraints={isMobile ? { top: 0, bottom: 0 } : { left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={handleDragEnd}
                        className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center cursor-grab active:cursor-grabbing"
                    >
                        {/* Left: Metadata */}
                        <div className="text-center md:text-right">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-[40px] sm:text-[80px] md:text-[120px] lg:text-[200px] font-bold font-sans leading-none text-white/5 select-none absolute md:relative top-0 left-0 md:top-auto md:left-auto"
                            >
                                {currentEvent.year || '----'}
                            </motion.div>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl sm:text-6xl md:text-8xl mb-4 relative z-10"
                            >
                                {currentEvent.emoji}
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="text-amber-500/90 font-serif text-xl sm:text-2xl md:text-3xl tracking-widest mb-3 relative z-10"
                            >
                                {formattedDateCN}
                            </motion.div>
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.45 }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight relative z-10"
                            >
                                {currentEvent.title}
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.55 }}
                                className="text-amber-500 font-mono text-xl"
                            >
                                {currentEvent.year}
                            </motion.div>
                        </div>

                        {/* Right: Content */}
                        <div className="glass-surface p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl relative max-h-[40vh] md:max-h-none overflow-y-auto no-scrollbar">
                            <motion.div
                                className="prose prose-invert prose-lg leading-relaxed text-slate-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.65 }}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentEvent.content}</ReactMarkdown>
                            </motion.div>
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Navigation Controls - horizontal on desktop, vertical on mobile */}
            {/* Desktop: horizontal buttons at bottom center */}
            <div className="hidden md:flex absolute bottom-12 left-0 right-0 z-50 justify-center gap-8">
                <button
                    onClick={() => paginate(-1)}
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full glass-surface hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 min-w-[48px] min-h-[48px] flex items-center justify-center"
                    aria-label="Previous event"
                >
                    <ArrowLeft size={24} className="w-8 h-8" />
                </button>
                <button
                    onClick={() => paginate(1)}
                    disabled={currentIndex === day.events.length - 1}
                    className="p-4 rounded-full glass-surface hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 min-w-[48px] min-h-[48px] flex items-center justify-center"
                    aria-label="Next event"
                >
                    <ArrowRight size={24} className="w-8 h-8" />
                </button>
            </div>

            {/* Mobile: vertical buttons on the right side */}
            <div className="md:hidden fixed right-4 bottom-8 z-50 flex flex-col gap-3">
                <button
                    onClick={() => paginate(-1)}
                    disabled={currentIndex === 0}
                    className="p-3 rounded-full glass-surface hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Previous event"
                >
                    <ArrowUp size={20} />
                </button>
                <button
                    onClick={() => paginate(1)}
                    disabled={currentIndex === day.events.length - 1}
                    className="p-3 rounded-full glass-surface hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Next event"
                >
                    <ArrowDown size={20} />
                </button>
            </div>

            {/* Swipe hint for mobile */}
            <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center md:hidden">
                <span className="text-xs text-slate-500 font-mono">↑ 上下滑动切换 ↓</span>
            </div>

        </div>
    );
}
