'use client';

import { FloatingLights } from '@/components/FloatingLights';
import { getAllDaysSummary } from '@/lib/api';
import { VerticalMonthList } from '@/components/VerticalMonthList';
import { MonthDrawer } from '@/components/MonthDrawer';
import { PrefaceModal } from '@/components/PrefaceModal';
import { BookOpen, Dices } from 'lucide-react';
import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
// Import meta data
import metaData from '@/data/meta.json';

export default function Home() {
  const allDays = getAllDaysSummary();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isPrefaceOpen, setIsPrefaceOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const { scrollY } = useScroll();

  // Content from meta.json (generated from InitialPage.md)
  const initialData = (metaData as any).initial || {};
  const heroTitle = initialData.title || "世界在你诞生的那一天更加美好";
  const heroSubtitle = initialData.subtitle || "探索你的生日与世界的最初联结";

  // Meteor Effect: Line transforms into a streak that shoots up
  const meteorY = useTransform(scrollY, [0, 300], [0, -600]); // Moves further up
  const meteorOpacity = useTransform(scrollY, [0, 200], [1, 0]); // Fades out later
  const meteorHeight = useTransform(scrollY, [0, 300], ["64px", "300px"]); // Gets longer

  const handleMonthSelect = (index: number) => {
    setSelectedMonth(index);
  };

  const handleRandom = () => {
    setIsRolling(true);
    setTimeout(() => {
      const randomDay = allDays[Math.floor(Math.random() * allDays.length)];
      router.push(`/day/${randomDay.id}`);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-slate-950 relative overflow-x-hidden font-sans">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-slate-900/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-amber-950/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 star-bg opacity-30 animate-twinkle" />
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 p-4 sm:p-6 md:p-8 flex justify-between items-center z-40 w-full pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
          <span className="text-white font-serif font-bold tracking-tight text-base sm:text-lg">生日大事记</span>
        </div>

        <div className="flex gap-2 sm:gap-4 pointer-events-auto">
          {/* Random Dice Button */}
          <button
            onClick={handleRandom}
            className="group flex items-center gap-2 justify-center px-3 py-2 sm:px-5 rounded-full glass-surface hover:bg-white/10 transition-all text-slate-400 hover:text-amber-400 min-w-[44px] min-h-[44px]"
            title="随机探索"
            aria-label="随机探索"
          >
            <span className="text-sm font-serif tracking-widest hidden md:inline">随机探索</span>
            <Dices size={20} className={`transition-transform duration-700 ${isRolling ? 'rotate-[360deg]' : 'group-hover:rotate-180'}`} />
          </button>

          {/* Preface Button */}
          <button
            onClick={() => setIsPrefaceOpen(true)}
            className="group flex items-center gap-2 px-3 py-2 sm:px-5 rounded-full glass-surface hover:bg-white/10 transition-all text-slate-400 hover:text-white min-w-[44px] min-h-[44px]"
            aria-label="序言"
          >
            <span className="text-sm font-serif tracking-widest hidden md:inline">序言</span>
            <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative z-10 overflow-hidden">
        {/* Interactive Stardust Background */}
        <FloatingLights />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-4xl relative z-10 px-2"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-6 sm:mb-8 tracking-wide leading-tight text-glow-gold">
            {heroTitle}
          </h1>
          <p className="text-slate-400 font-serif text-base sm:text-lg md:text-xl tracking-[0.1em] sm:tracking-[0.2em] opacity-80 decoration-amber-500/30 underline decoration-1 underline-offset-8">
            {heroSubtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{ opacity: meteorOpacity, y: meteorY }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10" // Removed opacity-60
        >
          <span className="text-xs font-serif text-slate-500 tracking-[0.3em]">滑动探索</span>
          <motion.div
            style={{ height: meteorHeight }}
            className="w-[2px] bg-gradient-to-t from-transparent via-amber-500 to-transparent shadow-[0_0_20px_#f59e0b]" // Brighter, ticker, directed gradient
          />
        </motion.div>
      </section>

      {/* Month List Section */}
      <section className="min-h-screen relative z-20 pb-40">
        <VerticalMonthList
          selectedMonth={selectedMonth}
          onSelect={handleMonthSelect}
        />
      </section>

      {/* Drawers & Modals */}
      <MonthDrawer
        isOpen={selectedMonth !== null}
        onClose={() => setSelectedMonth(null)}
        monthIndex={selectedMonth}
        days={allDays}
      />

      <PrefaceModal
        isOpen={isPrefaceOpen}
        onClose={() => setIsPrefaceOpen(false)}
        content={(metaData as any).coverContent || ''}
      />

    </main>
  );
}
