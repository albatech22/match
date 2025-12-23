'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Trophy } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface MatchHeaderProps {
    match: any;
    homeScore?: number;
    awayScore?: number;
    liveTime?: string;
}

export default function MatchHeader({ match, homeScore, awayScore, liveTime }: MatchHeaderProps) {
    // Robust status check
    const rawStatus = match.status || 'NS';
    const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(rawStatus);
    const isFinished = ['FT', 'AET', 'PEN', 'Finished'].includes(rawStatus);
    const isUpcoming = !isLive && !isFinished;

    return (
        <div className="relative bg-gradient-to-b from-[#0a0a0a] via-[#111] to-black border-b border-white/5">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }}></div>
            </div>

            {/* Back Button */}
            <div className="relative max-w-[1000px] mx-auto px-4 pt-6">
                <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Retour</span>
                </Link>
            </div>

            {/* Main Header Content */}
            <div className="relative max-w-[1000px] mx-auto px-4 py-8">
                {/* League & Status Badge */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-3.5 h-3.5 text-accent-cyan" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                {match.league || match.category || 'Football'}
                            </span>
                        </div>
                    </div>

                    {isLive && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                                    {match.timer || liveTime || "LIVE"}
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {isFinished && (
                        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                                Terminé
                            </span>
                        </div>
                    )}

                    {isUpcoming && (
                        <div className="px-3 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full backdrop-blur-sm">
                            <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
                                À Venir
                            </span>
                        </div>
                    )}
                </div>

                {/* Teams & Score */}
                <div className="flex items-center justify-between gap-4 md:gap-8">
                    {/* Home Team */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex-1 flex flex-col items-center gap-4"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-accent-cyan/20 blur-2xl group-hover:bg-accent-cyan/30 transition-all rounded-full opacity-50"></div>
                            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#1a1a1a] border-2 border-white/10 overflow-hidden flex items-center justify-center p-4 group-hover:border-accent-cyan/50 transition-all">
                                {match.home_badge || match.homeTeam?.badge || match.teams?.home?.badge ? (
                                    <img
                                        src={match.home_badge || match.homeTeam?.badge || match.teams?.home?.badge}
                                        alt={match.home_team || match.homeTeam?.name || match.teams?.home?.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="text-4xl">⚽</div>
                                )}
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-sm md:text-xl font-bold text-white max-w-[120px] md:max-w-none mx-auto leading-tight">
                                {match.home_team || match.homeTeam?.name || match.teams?.home?.name || 'Home'}
                            </h2>
                        </div>
                    </motion.div>

                    {/* Score or VS */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-center min-w-[100px]"
                    >
                        {isUpcoming ? (
                            <div className="flex flex-col items-center justify-center gap-2">
                                <span className="text-3xl md:text-5xl font-black text-white/10 tracking-widest">VS</span>
                                {match.startTime && (
                                    <span className="text-xs md:text-sm font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-1 rounded">
                                        {new Date(match.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 md:gap-4">
                                <div className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                                    {homeScore ?? 0}
                                </div>
                                <div className="text-2xl md:text-4xl font-black text-secondary/30">-</div>
                                <div className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                                    {awayScore ?? 0}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Away Team */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex-1 flex flex-col items-center gap-4"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-accent-purple/20 blur-2xl group-hover:bg-accent-purple/30 transition-all rounded-full opacity-50"></div>
                            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#1a1a1a] border-2 border-white/10 overflow-hidden flex items-center justify-center p-4 group-hover:border-accent-purple/50 transition-all">
                                {match.away_badge || match.awayTeam?.badge || match.teams?.away?.badge ? (
                                    <img
                                        src={match.away_badge || match.awayTeam?.badge || match.teams?.away?.badge}
                                        alt={match.away_team || match.awayTeam?.name || match.teams?.away?.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="text-4xl">⚽</div>
                                )}
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-sm md:text-xl font-bold text-white max-w-[120px] md:max-w-none mx-auto leading-tight">
                                {match.away_team || match.awayTeam?.name || match.teams?.away?.name || 'Away'}
                            </h2>
                        </div>
                    </motion.div>
                </div>

                {/* Match Info Bar */}
                {(match.stadium || match.referee || match.startTime) && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-secondary"
                    >
                        {match.startTime && !isLive && !isFinished && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{new Date(match.startTime).toLocaleString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                        )}
                        {match.stadium && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{match.stadium}</span>
                            </div>
                        )}
                        {match.referee && (
                            <div className="flex items-center gap-1.5">
                                <span>🏁</span>
                                <span>{match.referee}</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
