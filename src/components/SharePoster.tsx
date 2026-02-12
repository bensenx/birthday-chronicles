'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Download, Loader2 } from 'lucide-react';
import { EventItem } from '@/lib/types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';

interface SharePosterProps {
    isOpen: boolean;
    onClose: () => void;
    event: EventItem;
    date: string; // "MM-DD" format
    dayId: string; // e.g. "01_08"
}

// Strip basic markdown syntax for plain-text poster
function stripMarkdown(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/~~(.*?)~~/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/^#+\s+/gm, '')
        .replace(/^[-*]\s+/gm, '')
        .trim();
}

export function SharePoster({ isOpen, onClose, event, date, dayId }: SharePosterProps) {
    const posterRef = useRef<HTMLDivElement>(null);
    const [posterImage, setPosterImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    }, []);

    // Derive site URL from current page location (works on any host/basePath)
    const getSiteUrl = () => {
        if (typeof window === 'undefined') return '';
        const { origin, pathname } = window.location;
        const base = pathname.split('/day/')[0];
        return `${origin}${base}`;
    };

    // Generate QR code when modal opens
    useEffect(() => {
        if (!isOpen) return;
        QRCode.toDataURL(`${getSiteUrl()}/day/${dayId}`, {
            width: 120,
            margin: 1,
            color: { dark: '#f59e0bff', light: '#00000000' },
        }).then(setQrDataUrl);
    }, [isOpen, dayId]);

    // Generate poster image once QR is ready
    useEffect(() => {
        if (!isOpen || !qrDataUrl || !posterRef.current) return;
        setIsGenerating(true);
        const node = posterRef.current;
        // Allow DOM to paint before capturing
        const timer = setTimeout(() => {
            toPng(node, { width: 750, height: 1334, pixelRatio: 2 })
                .then(dataUrl => {
                    setPosterImage(dataUrl);
                    setIsGenerating(false);
                })
                .catch(() => setIsGenerating(false));
        }, 200);
        return () => clearTimeout(timer);
    }, [isOpen, qrDataUrl]);

    // Reset on close
    useEffect(() => {
        if (!isOpen) setPosterImage(null);
    }, [isOpen]);

    // Format date
    const [m, d] = date.split('-');
    const formattedDate = `${parseInt(m)}月${parseInt(d)}日`;

    // Truncate and strip markdown for poster
    const plainContent = stripMarkdown(event.content);
    const truncated = plainContent.length > 120
        ? plainContent.substring(0, 120) + '……'
        : plainContent;

    const handleDownload = useCallback(() => {
        if (!posterImage) return;
        const link = document.createElement('a');
        link.download = `生日大事记-${formattedDate}-${event.title}.png`;
        link.href = posterImage;
        link.click();
    }, [posterImage, formattedDate, event.title]);

    return (
        <>
            {/* Hidden poster template — positioned off-screen for html-to-image capture */}
            <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
                <div
                    ref={posterRef}
                    style={{
                        width: 750,
                        height: 1334,
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
                        fontFamily: '"Noto Serif SC", "Playfair Display", serif',
                        color: '#ffffff',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Star-dot texture */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: [
                            'radial-gradient(white, rgba(255,255,255,0.2) 2px, transparent 3px)',
                            'radial-gradient(white, rgba(255,255,255,0.15) 1px, transparent 2px)',
                        ].join(', '),
                        backgroundSize: '550px 550px, 350px 350px',
                        backgroundPosition: '0 0, 40px 60px',
                        opacity: 0.12,
                    }} />

                    {/* Amber glow accent */}
                    <div style={{
                        position: 'absolute',
                        top: '18%',
                        left: '20%',
                        width: 420,
                        height: 420,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
                    }} />

                    {/* Main content area */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px 50px 40px',
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        {/* Emoji */}
                        <div style={{ fontSize: 80, marginBottom: 28, lineHeight: 1 }}>
                            {event.emoji}
                        </div>

                        {/* Year with decorative lines */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            marginBottom: 28,
                        }}>
                            <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, #f59e0b)' }} />
                            <span style={{
                                fontSize: 22,
                                color: '#f59e0b',
                                fontFamily: '"Inter", monospace',
                                letterSpacing: '0.25em',
                            }}>
                                {event.year}
                            </span>
                            <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, #f59e0b)' }} />
                        </div>

                        {/* Event title */}
                        <div style={{
                            fontSize: 38,
                            fontWeight: 700,
                            textAlign: 'center',
                            lineHeight: 1.5,
                            marginBottom: 36,
                            maxWidth: 600,
                        }}>
                            {event.title}
                        </div>

                        {/* Content card */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 16,
                            padding: '28px 32px',
                            maxWidth: 600,
                            width: '100%',
                        }}>
                            <div style={{
                                fontSize: 21,
                                lineHeight: 1.9,
                                color: '#cbd5e1',
                                margin: 0,
                            }}>
                                {truncated}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '24px 50px 36px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
                                生日大事记
                            </div>
                            <div style={{ fontSize: 18, color: '#f59e0b', marginBottom: 4 }}>
                                {formattedDate}
                            </div>
                            <div style={{ fontSize: 13, color: '#64748b', fontFamily: '"Inter", monospace' }}>
                                {typeof window !== 'undefined' ? window.location.host : ''}
                            </div>
                        </div>
                        {qrDataUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={qrDataUrl} width={100} height={100} alt="QR" />
                        )}
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
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

                        {/* Modal content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[70] flex flex-col items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="relative pointer-events-auto max-w-sm w-full">
                                {/* Close */}
                                <button
                                    onClick={onClose}
                                    className="absolute -top-12 right-0 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                    aria-label="关闭"
                                >
                                    <X size={24} />
                                </button>

                                {/* Poster preview or loading spinner */}
                                {isGenerating || !posterImage ? (
                                    <div className="aspect-[750/1334] w-full rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 size={32} className="animate-spin text-amber-500" />
                                            <span className="text-xs text-slate-500 font-mono">生成海报中…</span>
                                        </div>
                                    </div>
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={posterImage}
                                        alt="分享海报"
                                        className="w-full rounded-2xl shadow-2xl"
                                    />
                                )}

                                {/* Actions */}
                                <div className="mt-4 flex justify-center">
                                    {isMobile ? (
                                        <span className="text-sm text-slate-400 font-serif tracking-wider">
                                            长按图片保存到相册
                                        </span>
                                    ) : (
                                        <button
                                            onClick={handleDownload}
                                            disabled={!posterImage}
                                            className="flex items-center gap-2 px-6 py-3 rounded-full glass-surface hover:bg-white/10 text-white font-serif text-sm tracking-wider disabled:opacity-30 transition-all"
                                        >
                                            <Download size={16} />
                                            下载海报
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </React.Fragment>
                )}
            </AnimatePresence>
        </>
    );
}
