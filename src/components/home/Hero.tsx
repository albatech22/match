'use client'
import { useState, useEffect } from 'react'
import { PlayCircle, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { useLiveMatches, useScores } from '@/hooks/useSportData'

export default function Hero() {
    const { matches, isLoading } = useLiveMatches();
    const { scores } = useScores('PL'); // Default to PL for now or make dynamic if we had league code

    // Fallback or real data
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate if multiple live matches? Or just let user click. 
    // Let's stick to user click for now to avoid annoyance, or auto-slide every 10s.

    // Select the match based on index
    const featuredMatch = matches?.[currentIndex] || matches?.[0];

    // Reset index if matches change drastically or on load? 
    // Actually, just keep it simple. If matches update, we might stay on index 0 or keep index.
    // Safe check:
    useEffect(() => {
        if (!matches || currentIndex >= matches.length) setCurrentIndex(0);
    }, [matches]);

    // Try to find score for this match
    // Matching by Team Name is risky but often necessary if IDs don't match across endpoints
    // API IDs might match though.
    const liveScore = scores?.find(s =>
        (s.home.name === featuredMatch?.home_team) ||
        (s.away.name === featuredMatch?.away_team)
    );

    // Formatting for display
    const formatTime = featuredMatch?.status === 'Live' ? (liveScore?.timer || 'LIVE') :
        featuredMatch?.status === 'Finished' ? 'FT' :
            (featuredMatch?.start_time?.slice(11, 16) || '20:00');

    const homeName = featuredMatch?.home_team || 'Team A';
    const awayName = featuredMatch?.away_team || 'Team B';
    const leagueName = featuredMatch?.league?.name || 'League';

    // Use Real Score if live/finished, otherwise 0-0 or finished score
    // If we don't have a score object, but it's finished, we use the deterministic score from the hook.
    const homeScore = liveScore ? liveScore.home.score :
        (featuredMatch?.status === 'Finished' && featuredMatch.home_score !== undefined) ? featuredMatch.home_score :
            (featuredMatch?.status === 'Live' ? 0 : '-');

    const awayScore = liveScore ? liveScore.away.score :
        (featuredMatch?.status === 'Finished' && featuredMatch.away_score !== undefined) ? featuredMatch.away_score :
            (featuredMatch?.status === 'Live' ? 0 : '-');

    return (
        <section className="relative w-full max-w-[1400px] mx-auto px-4 md:px-6 pt-10 pb-16">

            {/* Background Glow - Subtle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[400px] bg-accent/20 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: MAIN FEATURED MATCH */}
                <div className="lg:col-span-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-6"
                    >
                        <h1 className="text-xl md:text-3xl font-black italic tracking-wide text-white uppercase flex items-center gap-3">
                            {featuredMatch?.status === 'Live' && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>}
                            {featuredMatch?.status === 'Live' ? 'En Direct' : (featuredMatch?.status === 'Finished' ? 'Terminé' : 'À Venir')}
                        </h1>

                        {/* Pagination Indicators */}
                        <div className="flex gap-2">
                            {matches?.slice(0, 5).map((_, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentIndex ? 'w-8 bg-accent-cyan' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* GIANT CARD */}
                    <motion.div
                        key={featuredMatch?.id || 'skeleton'}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="relative w-full aspect-[4/5] md:aspect-[21/9] bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-[url('/assets/images/stadium.jpg')] bg-cover bg-center opacity-20 transition-transform duration-[2s] group-hover:scale-105"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center md:items-stretch md:justify-end p-6 md:p-12">

                            {/* Center Content Mobile / Bottom Content Desktop */}
                            <div className="flex flex-col md:flex-row items-center justify-between w-full h-full md:h-auto gap-8">

                                {/* Home Team */}
                                <div className="flex-1 flex flex-col items-center justify-center relative z-10 group/team">
                                    <div className="relative mb-6 transform transition-transform duration-300 group-hover/team:scale-110">
                                        {featuredMatch?.home_badge ? (
                                            <img src={featuredMatch.home_badge} alt={homeName} className="w-24 h-24 md:w-40 md:h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                                        ) : (
                                            <div className="w-24 h-24 md:w-40 md:h-40 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md">
                                                <Shield className="w-12 h-12 text-white/20" />
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-black text-white text-center leading-none tracking-tight">{homeName}</h2>
                                </div>

                                {/* VS / Score */}
                                <div className="flex flex-col items-center justify-center shrink-0 z-20 mx-4">
                                    {featuredMatch?.status === 'Live' ? (
                                        <div className="flex items-center gap-4 md:gap-8">
                                            <span className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl font-mono">{homeScore}</span>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                                <span className="text-red-500 font-bold text-xs tracking-widest uppercase mb-1">Live</span>
                                                <span className="text-accent-cyan font-mono text-xl md:text-2xl font-medium bg-black/40 px-3 rounded">{formatTime}</span>
                                            </div>
                                            <span className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl font-mono">{awayScore}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="text-4xl md:text-7xl font-black text-white/90 tracking-tighter font-mono">VS</div>
                                            <div className="mt-2 px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-md border border-white/5 text-white/70 text-sm font-bold tracking-wider">
                                                {formatTime}
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Buttons (Desktop) */}
                                    {matches && matches.length > 1 && (
                                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 justify-between px-4 w-full hidden md:flex pointer-events-none">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev > 0 ? prev - 1 : (matches?.length || 1) - 1); }}
                                                className="w-12 h-12 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all pointer-events-auto hover:scale-110 active:scale-95"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => prev < (matches?.length || 1) - 1 ? prev + 1 : 0); }}
                                                className="w-12 h-12 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all pointer-events-auto hover:scale-110 active:scale-95"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Away Team */}
                                <div className="flex-1 flex flex-col items-center justify-center relative z-10 group/team">
                                    <div className="relative mb-6 transform transition-transform duration-300 group-hover/team:scale-110">
                                        {featuredMatch?.away_badge ? (
                                            <img src={featuredMatch.away_badge} alt={awayName} className="w-24 h-24 md:w-40 md:h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                                        ) : (
                                            <div className="w-24 h-24 md:w-40 md:h-40 bg-white/5 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md">
                                                <Shield className="w-12 h-12 text-white/20" />
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-black text-white text-center leading-none tracking-tight">{awayName}</h2>
                                </div>
                            </div>

                            {/* Footer / Actions */}
                            <div className="w-full mt-8 pt-6 border-t border-white/5 flex items-center justify-center md:justify-between opacity-0 md:opacity-100 transition-opacity">
                                <div className="hidden md:flex gap-12 text-sm text-white/40 font-bold tracking-wider uppercase">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] mb-1">Ligue</span>
                                        <span className="text-white">{leagueName}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] mb-1">Journée</span>
                                        <span className="text-white">Journée 24</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] mb-1">Stade</span>
                                        <span className="text-white">Main Arena</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-wider rounded-full hover:bg-accent-cyan transition-colors shadow-lg shadow-white/10"
                                >
                                    <PlayCircle className="w-6 h-6 fill-current" />
                                    <span>Regarder le Live</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT: TRENDING LIST */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white tracking-tight">Tendances</h3>
                        <Link href="/matches" className="text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-wider">Tout Voir</Link>
                    </div>

                    <div className="flex flex-col gap-3">
                        {(matches?.slice(1, 4) || []).map((match, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                key={match.id || i}
                                className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5 hover:border-accent/30 transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Link href={`/match/${match.id}`} className="relative z-10 block">
                                    <div className="flex justify-between text-[10px] font-bold text-white/40 mb-3 uppercase tracking-wider">
                                        <span>{match.league?.name}</span>
                                        <span className={match.status === 'Live' ? 'text-red-500 animate-pulse' : 'text-white'}>
                                            {match.status === 'Live' ? 'DIRECT' : match.start_time?.slice(11, 16)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {match.home_badge ? <img src={match.home_badge} className="w-8 h-8 object-contain" /> : <div className="w-8 h-8 rounded-full bg-white/10"></div>}
                                            <span className="font-bold text-white text-sm truncate">{match.home_team}</span>
                                        </div>
                                        <div className="text-xs font-bold text-white/20 bg-white/5 px-2 py-1 rounded">VS</div>
                                        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                                            <span className="font-bold text-white text-sm truncate text-right">{match.away_team}</span>
                                            {match.away_badge ? <img src={match.away_badge} className="w-8 h-8 object-contain" /> : <div className="w-8 h-8 rounded-full bg-white/10"></div>}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Premium Banner */}
                    <motion.div
                        className="mt-auto rounded-2xl bg-gradient-to-br from-accent to-[#2cb67d] p-6 text-white relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h4 className="text-xl font-black mb-2">Analyse Pro</h4>
                            <p className="text-sm text-white/80 font-medium mb-4 leading-relaxed">Obtenez des stats détaillées et des prédictions.</p>
                            <button className="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-lg text-xs font-bold border border-white/10 hover:bg-white hover:text-black transition-all uppercase tracking-wide">
                                Créer un Compte
                            </button>
                        </div>
                        <Shield className="absolute -bottom-8 -right-8 w-32 h-32 text-black/10 rotate-12" />
                    </motion.div>
                </div>

            </div>
        </section>
    )
}
