'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// STARDUST CONFIGURATION
const PARTICLE_COUNT_DESKTOP = 60;
const PARTICLE_COUNT_MOBILE = 20;
const REPEL_RADIUS = 150;
const REPEL_STRENGTH = 100;

interface ParticleProps {
    x: number;
    y: number;
    size: number;
    mouseX: any;
    mouseY: any;
    delay: number;
    duration: number;
}

function Particle({ x, y, size, mouseX, mouseY, delay, duration }: ParticleProps) {
    // Current particle position (static base)
    // We want them to drift slowly, so we use keyframes for base movement
    // And useTransform for repel.

    // Calculate distance and repel vector
    // Note: useTransform with a function runs on every mouse update.
    const repelX = useTransform(mouseX, (mx: number) => {
        const dx = x - mx;
        const dy = y - (mouseY.get() as number);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < REPEL_RADIUS) {
            const force = (REPEL_RADIUS - distance) / REPEL_RADIUS;
            return dx === 0 ? 0 : (dx / distance) * force * REPEL_STRENGTH;
        }
        return 0;
    });

    const repelY = useTransform(mouseY, (my: number) => {
        const dx = x - (mouseX.get() as number);
        const dy = y - my;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < REPEL_RADIUS) {
            const force = (REPEL_RADIUS - distance) / REPEL_RADIUS;
            return dy === 0 ? 0 : (dy / distance) * force * REPEL_STRENGTH;
        }
        return 0;
    });

    // Smooth out the repel movement
    const smoothX = useSpring(repelX, { stiffness: 150, damping: 15 });
    const smoothY = useSpring(repelY, { stiffness: 150, damping: 15 });

    return (
        <motion.div
            className="absolute rounded-full bg-slate-200"
            style={{
                left: x,
                top: y,
                width: size,
                height: size,
                x: smoothX,
                y: smoothY,
            }}
            animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
            }}
        />
    );
}

export function FloatingLights() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(-1000);
    const mouseY = useMotionValue(-1000);
    const [particles, setParticles] = useState<Omit<ParticleProps, 'mouseX' | 'mouseY'>[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile on mount
    useEffect(() => {
        const mobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
        setIsMobile(mobile);
    }, []);

    // Generate particles on mount
    useEffect(() => {
        if (!containerRef.current) return;
        const { clientWidth, clientHeight } = containerRef.current;
        const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

        const newParticles = Array.from({ length: count }).map((_, i) => ({
            x: Math.random() * clientWidth,
            y: Math.random() * clientHeight,
            size: Math.random() * 3 + 1, // 1px - 4px
            delay: Math.random() * 5,
            duration: Math.random() * 3 + 3,
        }));
        setParticles(newParticles);
    }, [isMobile]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            mouseX.set(e.clientX - rect.left);
            mouseY.set(e.clientY - rect.top);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect && e.touches.length > 0) {
            const touch = e.touches[0];
            mouseX.set(touch.clientX - rect.left);
            mouseY.set(touch.clientY - rect.top);
        }
    };

    const handleMouseLeave = () => {
        mouseX.set(-1000);
        mouseY.set(-1000);
    };

    const handleTouchEnd = () => {
        mouseX.set(-1000);
        mouseY.set(-1000);
    };

    // On mobile, render simple static dots (no framer-motion springs)
    if (isMobile) {
        return (
            <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-slate-200 opacity-30"
                        style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none md:pointer-events-auto"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {particles.map((p, i) => (
                <Particle
                    key={i}
                    {...p}
                    mouseX={mouseX}
                    mouseY={mouseY}
                />
            ))}
        </div>
    );
}
