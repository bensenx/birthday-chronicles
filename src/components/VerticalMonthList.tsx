'use client';

import { motion } from 'framer-motion';

import metaData from '../data/meta.json';

interface VerticalMonthListProps {
    onSelect: (monthIndex: number) => void;
    selectedMonth: number | null;
}

export function VerticalMonthList({ onSelect, selectedMonth }: VerticalMonthListProps) {
    const months = metaData.initial.months;

    return (
        <div className="flex flex-col gap-0 w-full max-w-2xl mx-auto py-12 sm:py-24 px-4 sm:px-6 md:px-0">
            {months.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group cursor-pointer relative py-4 sm:py-6 md:py-8 min-h-[60px]"
                    onClick={() => onSelect(index)}
                >
                    <div className={`flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 md:gap-6 transition-all duration-500 ${selectedMonth === index ? 'translate-x-2 sm:translate-x-4 opacity-100' : 'opacity-40 group-hover:opacity-80 group-hover:translate-x-1 sm:group-hover:translate-x-2'}`}>
                        <span className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-bold shrink-0 ${selectedMonth === index ? 'text-amber-500 text-glow-gold' : 'text-slate-200'}`}>
                            {item.name}
                        </span>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1">
                                <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.1em] sm:tracking-[0.2em] text-slate-500">
                                    {item.id}
                                </span>
                                {item.subtitle && (
                                    <span className="text-[10px] sm:text-xs font-serif text-amber-500/80 tracking-widest border border-amber-500/30 px-1.5 sm:px-2 py-0.5 rounded-full">
                                        {item.subtitle}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm sm:text-base md:text-lg font-serif italic text-slate-400 font-light tracking-wider line-clamp-2">
                                {item.poem}
                            </span>
                        </div>
                    </div>

                    {/* Divider Line */}
                    <div className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-slate-800 to-transparent transition-all duration-500 ${selectedMonth === index ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'}`} />
                </motion.div>
            ))}
        </div>
    );
}
