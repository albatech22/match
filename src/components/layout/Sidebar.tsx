'use client';

import { useState, useMemo } from 'react';
import {
    BarChart3,
    Calendar,
    Clock,
    Heart,
    LayoutGrid,
    Play,
    Search,
    Settings,
    Star,
    Trophy,
    Dribbble,
    Menu,
    X
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveMatches } from '@/hooks/useSportData';

function MatchsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 5v14M3 12h18" />
        </svg>
    )
}

function PlayIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="14" rx="2" />
            <path d="M10 9l5 3-5 3V9z" fill="currentColor" fillOpacity="0.2" />
        </svg>
    )
}

function TvIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="13" rx="2" />
            <path d="M17 2l-5 5-5-5" />
        </svg>
    )
}

function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    )
}

const topCompetitions = [
    { id: 'wc', label: 'Coupe du monde', flag: '🌍' },
    { id: 'afcon', label: 'Coupe d\'Afrique des Nations', flag: '🌍' },
    { id: 'l1', label: 'Ligue 1', flag: '🇫🇷' },
    { id: 'l2', label: 'Ligue 2', flag: '🇫🇷' },
    { id: 'pl', label: 'Premier league', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'liga', label: 'Liga', flag: '🇪🇸' },
    { id: 'seriea', label: 'Serie A', flag: '🇮🇹' },
    { id: 'bundesliga', label: 'Bundesliga', flag: '🇩🇪' },
    { id: 'cl', label: 'Ligue des champions', flag: '🇪🇺' },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const { matches: liveMatches } = useLiveMatches();

    const liveCount = useMemo(() => {
        if (!liveMatches) return 0;
        return liveMatches.filter(m =>
            m.status === 'LIVE' || m.status === '1H' || m.status === '2H' || m.status === 'HT'
        ).length;
    }, [liveMatches]);

    const menuItems = [
        { id: 'matches', label: 'Matchs', icon: MatchsIcon, href: '/', active: true },
        { id: 'live', label: 'Directs', icon: Clock, href: '/live', badge: liveCount > 0 ? String(liveCount) : undefined },
        { id: 'favorites', label: 'Favoris', icon: Star, href: '/favorites' },
        { id: 'videos', label: 'Vidéos', icon: PlayIcon, href: '/videos' },
        { id: 'standings', label: 'Classement', icon: Trophy, href: '/standings' },
        { id: 'tv', label: 'Prog TV', icon: TvIcon, href: '/tv' },
        { id: 'settings', label: 'Réglages', icon: SettingsIcon, href: '/settings' },
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[100] p-4 bg-accent-cyan rounded-full shadow-lg text-black"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
                    />
                )}
            </AnimatePresence>

            <aside className={`
        fixed top-0 left-0 bottom-0 z-[90]
        w-[240px] bg-[#0A0A0A] border-r border-white/5
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full py-6 px-4 overflow-y-auto no-scrollbar">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 px-2 mb-8">
                        <div className="w-8 h-8 bg-accent-cyan rounded-lg flex items-center justify-center transform rotate-12">
                            <Star className="w-5 h-5 text-black fill-current" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-black text-white tracking-tighter uppercase">KIVU</span>
                            <span className="text-xl font-black text-white tracking-tighter uppercase">STREAM</span>
                        </div>
                    </Link>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Rechercher"
                            className="w-full bg-[#1A1A1A] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:ring-1 focus:ring-accent-cyan/50"
                        />
                    </div>

                    {/* Main Menu */}
                    <nav className="flex flex-col gap-1 mb-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group
                  ${item.active ? 'bg-white/5 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-5 h-5 ${item.active ? 'text-accent-cyan' : 'group-hover:text-accent-cyan'}`} />
                                    <span className="text-sm font-semibold">{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="w-5 h-5 bg-[#FF2D55] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Top Competitions */}
                    <div className="mt-auto">
                        <div className="flex items-center justify-between px-3 mb-4">
                            <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Top compétitions</span>
                            <ChevronDown className="w-4 h-4 text-white/30" />
                        </div>
                        <div className="flex flex-col gap-1">
                            {topCompetitions.map((comp) => (
                                <Link
                                    key={comp.id}
                                    href={`/league/${comp.id}`}
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:bg-white/5 hover:text-white transition-all group"
                                >
                                    <span className="text-base grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{comp.flag}</span>
                                    <span className="text-[13px] font-medium truncate">{comp.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

function ChevronDown({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    )
}
