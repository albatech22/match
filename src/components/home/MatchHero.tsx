'use client';

import { motion } from 'framer-motion';
import { Calendar, PlayCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { useLiveMatches } from '@/hooks/useSportData';
import { useEffect, useState } from 'react';

export default function MatchHero() {
    const { matches, isLoading } = useLiveMatches();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Prioritize Live matches, else Upcoming
    const featuredMatch = matches && matches.length > 0 ? matches[currentIndex] : null;

    useEffect(() => {
        if (!matches || currentIndex >= matches.length) setCurrentIndex(0);
    }, [matches]);

    if (!featuredMatch) {
        return (
            <div className="w-full max-w-[1400px] mx-auto min-h-[500px] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-accent-cyan animate-spin"></div>
            </div>
        );
    }

    const isLive = featuredMatch.status === 'Live' || featuredMatch.status === 'Live' /* API specific check needed? */;

    // Mock score for display if not fully in LiveMatch object yet
    const homeScore = isLive ? (featuredMatch.home_score ?? 2) : '-';
    const awayScore = isLive ? (featuredMatch.away_score ?? 1) : '-';
    const statusText = isLive ? "EN DIRECT" : "À VENIR";

    return (
        <section className="relative w-full max-w-[1400px] mx-auto px-4 md:px-6 pt-10 pb-16">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full aspect-[4/5] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-2xl group"
            >
                {/* Dynamic Background Image */}
                <div className="absolute inset-0 bg-[url('/assets/images/stadium.jpg')] bg-cover bg-center opacity-40 transition-transform duration-[30s] group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-purple/20 to-transparent mix-blend-overlay"></div>

                {/* Content Container */}
                <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center">

                    {/* Match Meta */}
                    <div className="mb-8 animate-in slide-in-from-left-4 duration-700 delay-100">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-white/80 mb-4">
                            <Shield className="w-3 h-3" />
                            {featuredMatch.league?.name}
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                            {featuredMatch.home_team}
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-white">VS</span>
                            {featuredMatch.away_team}
                        </h1>
                    </div>

                    {/* Match Status / Score / Time */}
                    <div className="flex items-center gap-8 mb-10 animate-in slide-in-from-left-4 duration-700 delay-200">
                        {isLive ? (
                            <div className="flex items-center gap-6">
                                <div className="text-6xl md:text-8xl font-black text-white font-mono tracking-tighter">
                                    {homeScore} - {awayScore}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="inline-block px-3 py-1 rounded bg-red-600 text-white text-xs font-bold uppercase tracking-wider animate-pulse">
                                        {statusText}
                                    </span>
                                    <span className="text-accent-cyan font-mono text-xl">
                                        74'
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center">
                                    <div className="text-sm text-secondary uppercase tracking-wider mb-1">Date</div>
                                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-accent-cyan" />
                                        {new Date(featuredMatch.start_time).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur text-center">
                                    <div className="text-sm text-secondary uppercase tracking-wider mb-1">Heure</div>
                                    <div className="text-2xl font-bold text-white font-mono">
                                        {new Date(featuredMatch.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CTA Actions */}
                    <div className="flex items-center gap-4 animate-in slide-in-from-left-4 duration-700 delay-300">
                        <Link href={`/match/${featuredMatch.id}`} className="group/btn relative px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-full hover:bg-accent-cyan transition-colors flex items-center gap-3 overflow-hidden">
                            <span className="relative z-10">Accéder au Match</span>
                            <PlayCircle className="w-5 h-5 relative z-10 group-hover/btn:scale-110 transition-transform" />
                        </Link>
                        <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-wider rounded-full hover:bg-white/10 transition-colors backdrop-blur-md">
                            Plus d'infos
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
