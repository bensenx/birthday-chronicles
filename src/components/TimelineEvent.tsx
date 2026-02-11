'use client';

import { motion } from 'framer-motion';
import { EventItem } from '@/lib/api';

interface TimelineEventProps {
    event: EventItem;
    index: number;
}

export function TimelineEvent({ event, index }: TimelineEventProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative pl-8 md:pl-0 md:grid md:grid-cols-12 gap-8 mb-16 last:mb-0 group"
        >
            {/* Timeline Line (Vertical) - Hidden on mobile, visible on MD */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2 group-last:bottom-auto group-last:h-full" />

            {/* Year/Title Side - Alternating */}
            <div className={`col-span-12 md:col-span-5 ${index % 2 === 0 ? 'md:text-right' : 'md:order-last md:text-left'} mb-4 md:mb-0`}>
                <div className="flex flex-col md:block">
                    <span className="text-5xl font-bold text-slate-800/50 md:text-slate-800/30 absolute md:static -z-10 -top-4 md:top-auto font-sans leading-none select-none">
                        {event.year}
                    </span>
                    <div className="relative z-10">
                        <span className="text-3xl mr-2 mb-2 inline-block shadow-sm">{event.emoji}</span>
                        <h3 className={`text-2xl font-serif font-bold text-amber-100 ${index % 2 === 0 ? 'md:ml-auto' : ''}`}>
                            {event.title}
                        </h3>
                        <span className="md:hidden text-xl font-mono text-amber-500/80 block mt-1">{event.year}</span>
                    </div>
                </div>
            </div>

            {/* Center Dot */}
            <div className="hidden md:flex col-span-2 justify-center items-start pt-2 relative">
                <div className="w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900 z-20 group-hover:bg-amber-500 transition-colors duration-500 shadow-[0_0_10px_rgba(251,191,36,0.2)]" />
            </div>

            {/* Content Side */}
            <div className={`col-span-12 md:col-span-5 ${index % 2 === 0 ? 'md:order-last md:text-left' : 'md:text-right'}`}>
                <div className={`prose prose-invert prose-slate max-w-none glass-panel p-6 rounded-lg ${index % 2 === 0 ? 'md:rounded-tl-none' : 'md:rounded-tr-none'}`}>
                    <p className="whitespace-pre-line leading-relaxed text-slate-300">
                        {event.content}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
