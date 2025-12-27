'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface MatchCardProps {
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeBadge?: string;
    awayBadge?: string;
    homeScore?: number | string;
    awayScore?: number | string;
    status: string; // 'FT', 'NS', '1H', etc.
    time?: string; // e.g., '21:00'
    timer?: string; // e.g., '45+'
}

function StatsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 13v7a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z" />
            <path d="M9 5v15a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1z" />
            <path d="M15 11v9a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1z" />
        </svg>
    );
}

function StarWithDotIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            <circle cx="19" cy="19" r="2" fill="currentColor" />
        </svg>
    );
}

export default function MatchCard({
    id,
    homeTeam,
    awayTeam,
    homeBadge,
    awayBadge,
    homeScore,
    awayScore,
    status,
    time,
    timer
}: MatchCardProps) {
    const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(status);
    const isFinished = ['FT', 'AET', 'PEN'].includes(status);
    const isUpcoming = status === 'NS';

    const renderStatus = () => {
        if (status === 'HT') return <span className="text-[#FF2D55] text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider"><span className="w-1 h-1 bg-[#FF2D55] rounded-full animate-pulse" />MT</span>;
        if (isLive) return <span className="text-[#FF2D55] text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider"><span className="w-1 h-1 bg-[#FF2D55] rounded-full animate-pulse" />{timer || "LIVE"}</span>;
        if (isFinished) return <span className="text-white/30 text-[11px] font-bold uppercase tracking-wider">Terminé</span>;

        // For upcoming matches, show formatted time
        if (time) {
            return <span className="text-accent-cyan text-[11px] font-bold uppercase tracking-wider">{time}</span>;
        }

        return <span className="text-white/30 text-[11px] font-bold uppercase tracking-wider">--:--</span>;
    };

    return (
        <Link href={`/match/${id}`}>
            <motion.div
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                className="bg-[#121212] rounded-xl p-4 border border-white/5 transition-all group"
            >
                <div className="flex items-center">
                    {/* Left Section: Teams & Scores */}
                    <div className="flex-1 flex flex-col gap-3.5">
                        {/* Home Team */}
                        <div className="flex items-center justify-between pr-4">
                            <div className="flex items-center gap-3 min-w-0">
                                {homeBadge ? (
                                    <img src={homeBadge} className="w-5 h-5 object-contain flex-shrink-0" alt="" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-white/5 flex-shrink-0" />
                                )}
                                <span className="text-[14px] font-semibold text-white/40 group-hover:text-white/60 transition-colors truncate">{homeTeam}</span>
                            </div>
                            <span className="text-[16px] font-black text-white ml-2 flex-shrink-0">
                                {!isUpcoming ? (homeScore ?? '0') : ''}
                            </span>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center justify-between pr-4">
                            <div className="flex items-center gap-3 min-w-0">
                                {awayBadge ? (
                                    <img src={awayBadge} className="w-5 h-5 object-contain flex-shrink-0" alt="" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-white/5 flex-shrink-0" />
                                )}
                                <span className="text-[14px] font-semibold text-white/40 group-hover:text-white/60 transition-colors truncate">{awayTeam}</span>
                            </div>
                            <span className="text-[16px] font-black text-white ml-2 flex-shrink-0">
                                {!isUpcoming ? (awayScore ?? '0') : ''}
                            </span>
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="w-px h-11 bg-white/5 mx-5" />

                    {/* Right Section: Status & Icons */}
                    <div className="w-24 flex flex-col items-center gap-3.5">
                        {renderStatus()}
                        <div className="flex items-center gap-5">
                            <StatsIcon className="w-[18px] h-[18px] text-white/20 group-hover:text-white/40 transition-colors" />
                            <StarWithDotIcon className="w-[18px] h-[18px] text-white/20 group-hover:text-white/40 transition-colors" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
