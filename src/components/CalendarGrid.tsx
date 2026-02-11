'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { DaySummary } from '@/lib/api';

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

interface CalendarGridProps {
    monthIndex: number; // 0-based
    filteredDays: DaySummary[];
    onHoverDay: (day: DaySummary | null) => void;
}

export function CalendarGrid({ monthIndex, filteredDays, onHoverDay }: CalendarGridProps) {
    const totalDays = DAYS_IN_MONTH[monthIndex] ?? 31;
    const monthStr = (monthIndex + 1).toString().padStart(2, '0');

    // Build lookup map: day number -> DaySummary
    const dayMap = new Map<number, DaySummary>();
    filteredDays.forEach(d => {
        const dayNum = parseInt(d.id.split('_')[1]);
        dayMap.set(dayNum, d);
    });

    const cells = Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
        <div className="w-full">
            <motion.div
                className="grid grid-cols-7 gap-1.5 sm:gap-2.5"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.02 }
                    }
                }}
            >
                {cells.map(dayNum => {
                    const entry = dayMap.get(dayNum);
                    const dayStr = dayNum.toString().padStart(2, '0');
                    const hasData = !!entry;

                    return (
                        <motion.div
                            key={dayNum}
                            variants={{
                                hidden: { opacity: 0, y: 8 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            {hasData ? (
                                <Link
                                    href={`/day/${monthStr}_${dayStr}`}
                                    onMouseEnter={() => onHoverDay(entry)}
                                    onMouseLeave={() => onHoverDay(null)}
                                    className="aspect-square flex flex-col items-center justify-center rounded-xl
                                        glass-surface hover:bg-white/10 hover:border-amber-500/30
                                        transition-all duration-300 cursor-pointer group relative"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex flex-col items-center justify-center w-full h-full"
                                    >
                                        <span className="text-white font-serif text-lg sm:text-xl font-bold group-hover:text-amber-200 transition-colors">
                                            {dayNum}
                                        </span>
                                        <span className="text-[10px] sm:text-[11px] font-mono text-amber-500/80 mt-0.5">
                                            {entry.eventCount} 事件
                                        </span>
                                    </motion.div>
                                </Link>
                            ) : (
                                <div className="aspect-square flex items-center justify-center rounded-xl opacity-20">
                                    <span className="text-slate-600 font-serif text-lg">
                                        {dayNum}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Preview hint */}
            <div className="mt-4 text-center">
                <span className="text-xs font-mono text-slate-500 tracking-wider hidden sm:inline">
                    悬停预览 · 点击探索
                </span>
                <span className="text-xs font-mono text-slate-500 tracking-wider sm:hidden">
                    点击探索
                </span>
            </div>
        </div>
    );
}

interface CalendarPreviewCardProps {
    day: DaySummary | null;
}

export function CalendarPreviewCard({ day }: CalendarPreviewCardProps) {
    const formatDate = (date: string) => {
        const [m, d] = date.split('-');
        return `${parseInt(m)}月${parseInt(d)}日`;
    };

    return (
        <AnimatePresence mode="wait">
            {day && (
                <motion.div
                    key={day.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="glass-surface rounded-2xl p-5 sm:p-6"
                >
                    <div className="flex items-baseline justify-between mb-3">
                        <h3 className="text-amber-200 font-serif text-xl sm:text-2xl font-bold">
                            {formatDate(day.date)}
                        </h3>
                        <span className="text-xs font-mono text-slate-500">
                            {day.eventCount} 个事件
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
                        {day.intro}
                    </p>
                    <Link
                        href={`/day/${day.id}`}
                        className="inline-flex items-center text-amber-500/80 text-xs font-mono tracking-widest hover:text-amber-400 transition-colors"
                    >
                        EXPLORE <span className="ml-2">→</span>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
