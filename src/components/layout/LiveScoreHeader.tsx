'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Trophy, Activity, } from 'lucide-react';

const SPORTS = [
    { id: 'football', label: 'Football', icon: Trophy },
    { id: 'basketball', label: 'Basketball', icon: Activity },
    { id: 'tennis', label: 'Tennis', icon: Activity }, // Using generic icon if specific not available
    { id: 'esports', label: 'eSports', icon: Activity },
];

// Generate simple date list (Today - 2 to Today + 2)
const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = -2; i <= 2; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push({
            date: d,
            label: i === 0 ? 'AUJOURD\'HUI' : d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }).toUpperCase(),
            isToday: i === 0
        });
    }
    return dates;
};

export default function LiveScoreHeader() {
    const [mounted, setMounted] = useState(false);
    const [activeSport, setActiveSport] = useState('football');
    const [activeDate, setActiveDate] = useState(0); // Index of today in the generated list (2)

    useEffect(() => {
        setMounted(true);
    }, []);

    const dates = mounted ? generateDates() : [];

    if (!mounted) {
        return (
            <div className="w-full bg-[#121212] border-b border-white/10 pt-20 pb-0 min-h-[160px]">
                <div className="max-w-[1000px] mx-auto px-4">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="h-4 w-24 bg-white/5 animate-pulse rounded"></div>
                        <div className="h-4 w-24 bg-white/5 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#121212] border-b border-white/10 pt-20 pb-0">
            <div className="max-w-[1000px] mx-auto px-4">

                {/* Sports Selector */}
                <div className="flex items-center gap-6 mb-4 overflow-x-auto no-scrollbar">
                    {SPORTS.map((sport) => {
                        const Icon = sport.icon;
                        const isActive = activeSport === sport.id;
                        return (
                            <button
                                key={sport.id}
                                onClick={() => setActiveSport(sport.id)}
                                className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${isActive
                                    ? 'border-accent-cyan text-white'
                                    : 'border-transparent text-secondary hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-accent-cyan' : ''}`} />
                                <span className="text-sm font-bold uppercase tracking-wider">{sport.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Date Strip */}
                <div className="hidden md:hidden lg:hidden items-center justify-between py-2 bg-[#1a1a1a] rounded-t-xl border-x border-t border-white/5 relative top-[1px]">
                    <button className="p-2 text-secondary hover:text-white"><ChevronLeft className="w-5 h-5" /></button>

                    <div className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar px-2">
                        {dates.map((d, index) => (
                            <button
                                key={index}
                                className={`flex flex-col items-center justify-center min-w-[80px] py-1 px-2 rounded-lg transition-colors ${d.isToday
                                    ? 'bg-accent-cyan text-black'
                                    : 'hover:bg-white/5 text-secondary hover:text-white'
                                    }`}
                            >
                                <span className={`text-[10px] font-black uppercase ${d.isToday ? 'opacity-100' : 'opacity-50'}`}>
                                    {d.label.split(' ')[0]}
                                </span>
                                <span className="text-xs font-bold">
                                    {d.date.getDate()} {d.date.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}
                                </span>
                            </button>
                        ))}

                        <button className="flex flex-col items-center justify-center min-w-[40px] py-1 px-2 rounded-lg hover:bg-white/5 text-secondary">
                            <Calendar className="w-4 h-4 mb-1" />
                        </button>
                    </div>

                    <button className="p-2 text-secondary hover:text-white"><ChevronRight className="w-5 h-5" /></button>
                </div>
            </div>
        </div>
    );
}
