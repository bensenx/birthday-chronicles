'use client';

import { motion } from 'framer-motion';

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface TimeSliderProps {
    currentMonth?: number; // 0-11
    onMonthSelect: (monthIndex: number) => void;
}

export function TimeSlider({ currentMonth = 0, onMonthSelect }: TimeSliderProps) {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-6">
            <div className="glass-surface rounded-full h-14 px-6 flex items-center justify-between shadow-2xl relative overflow-hidden">
                {/* Active Highlight (approximate) */}

                {MONTHS.map((m, i) => (
                    <button
                        key={m}
                        onClick={() => onMonthSelect(i)}
                        className={`text-xs font-mono transition-all duration-300 relative z-10 px-2 py-1 rounded hover:bg-white/10 ${
                            // Simple logic: Highlight current month
                            // Real implementation would track scroll position precisely
                            i === currentMonth ? 'text-amber-400 font-bold scale-110' : 'text-slate-500'
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>
        </div>
    );
}
