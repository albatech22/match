'use client'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

interface MatchCardProps {
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeBadge?: string;
    awayBadge?: string;
    time: string;
    league: string;
    status: 'live' | 'upcoming' | 'finished';
}

import Link from 'next/link'

export default function MatchCard({ id, homeTeam, awayTeam, homeBadge, awayBadge, time, league, status }: MatchCardProps) {
    return (
        <Link href={`/match/${id}`}>
            <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative bg-surface rounded-2xl p-5 border border-white/5 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(127,90,240,0.15)] transition-all cursor-pointer group overflow-hidden"
            >
                {status === 'live' && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-status-live rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase text-status-live tracking-wider">DIRECT</span>
                    </div>
                )}

                <div className="text-xs text-secondary font-mono uppercase tracking-wide mb-4">{league}</div>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-accent transition-colors overflow-hidden">
                            {homeBadge ? (
                                <img src={homeBadge} alt={homeTeam} className="w-8 h-8 object-contain" />
                            ) : (
                                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                            )}
                        </div>
                        <span className="text-sm font-bold text-white text-center">{homeTeam}</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-mono font-bold text-white group-hover:text-accent-cyan transition-colors">{time}</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-accent transition-colors overflow-hidden">
                            {awayBadge ? (
                                <img src={awayBadge} alt={awayTeam} className="w-8 h-8 object-contain" />
                            ) : (
                                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                            )}
                        </div>
                        <span className="text-sm font-bold text-white text-center">{awayTeam}</span>
                    </div>
                </div>

                <div className="w-full text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-xs text-secondary font-bold group-hover:bg-accent group-hover:text-white transition-colors">
                        Voir le Match
                    </span>
                </div>
            </motion.div>
        </Link>
    )
}
