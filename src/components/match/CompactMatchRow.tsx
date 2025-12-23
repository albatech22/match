'use client';

import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CompactMatchRowProps {
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeBadge?: string;
    awayBadge?: string;
    matchDate?: string;
    time: string;
    status: 'live' | 'upcoming' | 'finished';
    minutesUntilStart?: number;
    homeScore?: number | string;
    awayScore?: number | string;
    timer?: string; // New prop for live match timer
}

export default function CompactMatchRow({ id, homeTeam, awayTeam, homeBadge, awayBadge, matchDate, time, status, minutesUntilStart, homeScore, awayScore, timer }: CompactMatchRowProps) {
    const isLive = status === 'live';

    return (
        <Link href={`/match/${id}`}>
            <motion.div
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="flex items-center gap-2 md:gap-4 px-3 md:px-4 py-3 md:py-4 border-b border-white/5 cursor-pointer group hover:bg-white/5 transition-colors"
            >
                {/* Time / Status Column */}
                <div className="w-14 md:w-16 flex flex-col items-center justify-center shrink-0">
                    {isLive ? (
                        <div className="flex flex-col items-center gap-1">
                            {/* Live Indicator */}
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-[10px] md:text-xs font-bold text-red-500 tracking-wider">LIVE</span>
                            </div>
                            {/* Timer */}
                            <span className="text-accent-cyan font-mono font-bold text-xs">{timer || "1'"}</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-secondary">
                            {/* Only show date here if it's relevant, usually handled by group header though. 
                                keeping it minimal: JUST time */}
                            <span className="text-xs md:text-sm font-bold text-white/90 font-mono tracking-tight">{time}</span>

                            {/* Minutes until (optional, kept if close) */}
                            {status === 'upcoming' && minutesUntilStart !== undefined && minutesUntilStart > 0 && minutesUntilStart < 60 && (
                                <span className="text-[9px] text-accent-cyan font-medium mt-0.5">{minutesUntilStart} min</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Match Info Grid */}
                <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
                    {/* Home Team */}
                    <div className="flex items-center justify-end gap-2 md:gap-3 text-right">
                        <span className={`text-xs md:text-sm font-bold truncate max-w-[100px] md:max-w-none ${isLive ? 'text-white' : 'text-gray-300'} group-hover:text-white transition-colors`}>
                            {homeTeam}
                        </span>
                        {homeBadge ? (
                            <img src={homeBadge} className="w-5 h-5 md:w-7 md:h-7 object-contain shrink-0" alt="" />
                        ) : (
                            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-white/10 shrink-0"></div>
                        )}
                    </div>

                    {/* Score / VS Display */}
                    <div className="w-12 md:w-16 flex justify-center shrink-0">
                        {status === 'upcoming' ? (
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/30 font-bold">
                                VS
                            </div>
                        ) : (
                            <div className={`px-2 md:px-3 py-1 bg-black/40 rounded-lg border border-white/10 flex items-center justify-center gap-1 min-w-[50px] md:min-w-[60px] ${isLive ? 'border-accent-cyan/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : ''}`}>
                                <span className={`text-sm md:text-base font-bold font-mono ${isLive ? 'text-accent-cyan' : 'text-white'}`}>
                                    {homeScore !== undefined ? homeScore : 0}
                                </span>
                                <span className="text-white/20 text-xs">-</span>
                                <span className={`text-sm md:text-base font-bold font-mono ${isLive ? 'text-accent-cyan' : 'text-white'}`}>
                                    {awayScore !== undefined ? awayScore : 0}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-2 md:gap-3 text-left">
                        {awayBadge ? (
                            <img src={awayBadge} className="w-5 h-5 md:w-7 md:h-7 object-contain shrink-0" alt="" />
                        ) : (
                            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-white/10 shrink-0"></div>
                        )}
                        <span className={`text-xs md:text-sm font-bold truncate max-w-[100px] md:max-w-none ${isLive ? 'text-white' : 'text-gray-300'} group-hover:text-white transition-colors`}>
                            {awayTeam}
                        </span>
                    </div>
                </div>

                {/* Favorite / Action (Desktop only mostly) */}
                <div className="w-8 hidden md:flex items-center justify-center text-white/10 group-hover:text-accent-cyan/50 hover:!text-accent-cyan transition-colors">
                    <Star className="w-4 h-4" />
                </div>

                {/* Mobile Chevron */}
                <div className="md:hidden text-white/10">
                    <ChevronRight className="w-4 h-4" />
                </div>
            </motion.div>
        </Link>
    );
}
