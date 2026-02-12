import { AnimatePresence, motion } from 'framer-motion';
import { DaySummary } from '@/lib/types';
import { CalendarGrid, CalendarPreviewCard } from './CalendarGrid';
import { X } from 'lucide-react';
import React, { useState } from 'react';

const MONTH_NAMES_CN = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

interface MonthDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    monthIndex: number | null;
    days: DaySummary[];
}

export function MonthDrawer({ isOpen, onClose, monthIndex, days }: MonthDrawerProps) {
    const [hoveredDay, setHoveredDay] = useState<DaySummary | null>(null);

    // Filter days for this month
    const filteredDays = days.filter(d => {
        const m = parseInt(d.id.split('_')[0]);
        return m === (monthIndex !== null ? monthIndex + 1 : -1);
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full lg:w-[600px] bg-slate-925/95 backdrop-blur-xl border-l border-slate-800 z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-6 md:p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <div>
                                <span className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-1 block">选择日期</span>
                                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                                    {monthIndex !== null ? MONTH_NAMES_CN[monthIndex] : ''}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label="Close drawer"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar">
                            {monthIndex !== null && (
                                <CalendarGrid
                                    monthIndex={monthIndex}
                                    filteredDays={filteredDays}
                                    onHoverDay={setHoveredDay}
                                />
                            )}

                            {/* Preview Card */}
                            <div className="mt-4">
                                <CalendarPreviewCard day={hoveredDay} />
                            </div>
                        </div>

                    </motion.div>
                </React.Fragment>
            )}
        </AnimatePresence>
    );
}
