'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { DayEntry } from '@/lib/api';

interface DateCardProps {
    day: DayEntry;
    index: number;
}

export function DateCard({ day, index }: DateCardProps) {
    // Format MM_DD to MM.DD for a cleaner look
    const [month, date] = day.id.split('_');
    const monthNum = parseInt(month);
    const dateNum = parseInt(date);

    // Pad with zero for design consistency
    const formattedDate = `${monthNum.toString().padStart(2, '0')}.${dateNum.toString().padStart(2, '0')}`;

    return (
        <motion.div
            layoutId={`card-${day.id}`}
            className="shrink-0 relative w-[85vw] max-w-[280px] h-[400px] sm:w-[280px] sm:h-[450px] md:w-[320px] md:h-[500px]"
            whileHover={{ y: -20, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <Link href={`/day/${day.id}`} className="block h-full group">
                <div className="glass-surface h-full rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative transition-colors duration-500 hover:bg-white/5 border-slate-800 hover:border-amber-500/50">

                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-[60px] rounded-full -mr-10 -mt-10 group-hover:bg-amber-500/30 transition-all duration-700" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 blur-[50px] rounded-full -ml-10 -mb-10 opacity-50" />

                    {/* Top Content */}
                    <div className="relative z-10">
                        <span className="text-slate-500 font-mono text-xs sm:text-sm tracking-widest uppercase mb-2 block">
                            {day.events.length} Events
                        </span>
                        <h2 className="text-5xl sm:text-6xl font-serif text-white font-bold group-hover:text-amber-200 transition-colors tracking-tighter">
                            {formattedDate}
                        </h2>
                    </div>

                    {/* Bottom Content / Intro Preview */}
                    <div className="relative z-10">
                        <div className="mask-fade-b">
                            <p className="text-slate-400 font-light text-sm leading-relaxed line-clamp-4 font-sans opacity-80 group-hover:opacity-100 transition-opacity">
                                {day.intro}
                            </p>
                        </div>
                        <div className="mt-6 flex items-center text-amber-500/80 text-xs font-mono tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                            EXPLORE <span className="ml-2">→</span>
                        </div>
                    </div>

                </div>
            </Link>
        </motion.div>
    );
}
