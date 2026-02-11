import { AnimatePresence, motion } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import React from 'react';

interface PrefaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
}

export function PrefaceModal({ isOpen, onClose, content }: PrefaceModalProps) {
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }} // Faster, snappier
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 pointer-events-none"
                    >
                        <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl pointer-events-auto relative no-scrollbar overflow-hidden">

                            {/* Background Effect: Amber Blob (Matches EventFocusView) */}
                            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />

                            {/* Close Button - Fixed to top right of container */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>

                            {/* Split Content */}
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center p-4 sm:p-6 md:p-8 lg:p-12 min-h-[400px] md:min-h-[600px]">

                                {/* Left Column: Visuals & Branding */}
                                <div className="text-center md:text-right relative">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[200px] font-bold font-sans leading-none text-white/5 select-none absolute md:relative top-0 left-0 md:top-auto md:left-auto"
                                    >
                                        00
                                    </motion.div>

                                    <div className="relative z-10 flex flex-col items-center md:items-end">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-amber-500 mb-4 sm:mb-6"
                                        >
                                            <BookOpen size={60} className="sm:w-20 sm:h-20" strokeWidth={1} />
                                        </motion.div>

                                        <motion.h1
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-2 sm:mb-4 leading-tight"
                                        >
                                            生日大事记
                                        </motion.h1>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-slate-400 font-serif text-sm sm:text-base md:text-lg tracking-[0.1em] sm:tracking-[0.2em]"
                                        >
                                            致敬生命中的每一个日子
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Right Column: Content Card */}
                                <div className="glass-surface p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl relative h-full max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] overflow-y-auto no-scrollbar">
                                    <motion.div
                                        className="prose prose-invert prose-lg leading-loose text-slate-300 font-serif"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <ReactMarkdown>{content}</ReactMarkdown>
                                    </motion.div>

                                    <div className="mt-8 text-center opacity-60">
                                        <span className="w-1 h-1 rounded-full bg-amber-500 inline-block mb-3 shadow-[0_0_10px_#f59e0b]" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </React.Fragment>
            )}
        </AnimatePresence>
    );
}
