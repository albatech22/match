'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useLiveMatches } from '@/hooks/useSportData';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Link from 'next/link';

const dates = [
    { day: 'dim. 21', active: false },
    { day: 'lun. 22', active: false },
    { day: 'Aujourd\'hui', isSpecial: true, active: true },
    { day: 'mer. 24', active: false },
    { day: 'jeu. 25', active: false },
];

export default function DesktopHeader() {
    const { matches: liveMatches } = useLiveMatches();
    const liveCount = liveMatches?.length || 0;

    return (
        <header className="hidden lg:flex sticky top-0 z-[100] bg-[#050505] border-b border-white/5 h-14 items-center justify-between px-10">
            {/* Left Spacer */}
            <div className="flex-1" />

            {/* Center: Date Selector */}
            <div className="flex items-center gap-8">
                <button className="text-white/40 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5 outline-none" />
                </button>

                <div className="flex items-center gap-10">
                    {dates.slice(0, 2).map((date, idx) => (
                        <button key={idx} className="text-[13px] font-bold text-white/40 hover:text-white transition-colors whitespace-nowrap">
                            {date.day}
                        </button>
                    ))}

                    <button className="flex items-center gap-2.5 px-5 py-2.5 bg-[#1a1a1a] border border-white/5 rounded-xl text-white text-[13px] font-black shadow-lg ring-1 ring-white/5 grayscale-[0.5]">
                        <Calendar className="w-4 h-4 text-white/40" />
                        Aujourd'hui
                    </button>

                    {dates.slice(3).map((date, idx) => (
                        <button key={idx} className="text-[13px] font-bold text-white/40 hover:text-white transition-colors whitespace-nowrap">
                            {date.day}
                        </button>
                    ))}
                </div>

                <button className="text-white/40 hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5 outline-none" />
                </button>
            </div>

            {/* Right Group: Badge + Theme Toggle */}
            <div className="flex-1 flex justify-end items-center gap-3">
                <ThemeToggle />
                <Link href="/live" className="flex items-center gap-2 px-3 py-1.5 border border-[#FF2D55]/60 rounded-md hover:bg-[#FF2D55]/5 transition-all">
                    <div className="w-1.5 h-1.5 bg-[#FF2D55] rounded-full shadow-[0_0_8px_rgba(255,45,85,0.5)]" />
                    <span className="text-[#FF2D55] font-bold text-[13px] leading-none tracking-tight lowercase">
                        {liveCount} directs
                    </span>
                </Link>
            </div>
        </header>
    );
}
