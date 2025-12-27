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

    // Extract league information
    const leagueName = match.league?.name || match.league || match.category || 'Football';
    const leagueYear = match.league?.year || '';
    const stageName = match.league?.stage || '';
    const matchRound = match.league?.round || '';

    // Build subtitle dynamically
    const subtitle = [
        leagueName,
        leagueYear,
        stageName,
        matchRound && `Journée ${matchRound}`
    ].filter(Boolean).join(' · ');

    return (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            {/* Card Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white">Matchs</h3>
                </div>
                <Link href="#" className="text-secondary hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>
                </Link>
            </div>

            <div className="p-6">
                {/* League Subheader - Dynamic */}
                <div className="text-secondary text-xs mb-8 flex items-center gap-2">
                    <span className="truncate">{subtitle || leagueName}</span>
                </div>

                {/* Main Score/Teams area */}
                <div className="flex items-center justify-between gap-4 mb-10">
                    {/* Home Team */}
                    <div className="flex-1 flex flex-col items-center gap-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#2a2a2a] p-3 flex items-center justify-center border border-white/10 shadow-lg">
                            {match.home_badge || match.homeTeam?.badge ? (
                                <img
                                    src={match.home_badge || match.homeTeam?.badge}
                                    alt={match.home_team || match.homeTeam?.name}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-3xl">⚽</div>
                            )}
                        </div>
                        <span className="text-lg font-bold text-center leading-tight">
                            {match.home_team || match.homeTeam?.name || 'Home'}
                        </span>
                    </div>

                    {/* Middle Score/Status Section */}
                    <div className="flex-1 flex flex-col items-center justify-center min-w-[120px]">
                        <div className="flex items-baseline gap-4 mb-2">
                            <span className="text-6xl md:text-7xl font-black text-white">{homeScore ?? 0}</span>
                            <span className="text-6xl md:text-7xl font-black text-white">{awayScore ?? 0}</span>
                        </div>

                        <div className="text-center">
                            {isLive && (
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest animate-pulse">EN DIRECT</span>
                                    <span className="text-sm font-bold text-secondary">{liveTime || match.timer || "Live"}</span>
                                </div>
                            )}
                            {isFinished && (
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-bold text-secondary uppercase tracking-tight">Terminé</span>
                                    <span className="text-xs text-secondary/60">Aujourd'hui</span>
                                </div>
                            )}
                            {isUpcoming && (
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs font-bold text-accent-cyan uppercase tracking-widest">À VENIR</span>
                                    {match.startTime && (
                                        <span className="text-sm font-bold text-secondary">
                                            {new Date(match.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex flex-col items-center gap-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#2a2a2a] p-3 flex items-center justify-center border border-white/10 shadow-lg">
                            {match.away_badge || match.awayTeam?.badge ? (
                                <img
                                    src={match.away_badge || match.awayTeam?.badge}
                                    alt={match.away_team || match.awayTeam?.name}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-3xl">⚽</div>
                            )}
                        </div>
                        <span className="text-lg font-bold text-center leading-tight">
                            {match.away_team || match.awayTeam?.name || 'Away'}
                        </span>
                    </div>
                </div>

                {/* Card Footer Match Highlights */}
                <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar w-full md:w-auto">
                        {match.teamFixtures?.home?.slice(0, 1).map((f: any, i: number) => (
                            <Link key={`home-${i}`} href={`/match/${f.fixture.id}`} className="flex-shrink-0 flex items-center gap-2 text-xs text-secondary bg-white/[0.03] px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors">
                                <span className="font-bold text-white">{f.teams.home.name} v {f.teams.away.name}</span>
                                <span>{new Date(f.fixture.date).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</span>
                            </Link>
                        ))}
                        {match.teamFixtures?.away?.slice(0, 1).map((f: any, i: number) => (
                            <Link key={`away-${i}`} href={`/match/${f.fixture.id}`} className="flex-shrink-0 flex items-center gap-2 text-xs text-secondary bg-white/[0.03] px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors">
                                <span className="font-bold text-white">{f.teams.home.name} v {f.teams.away.name}</span>
                                <span>{new Date(f.fixture.date).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</span>
                            </Link>
                        ))}

                        {(!match.teamFixtures?.home?.length && !match.teamFixtures?.away?.length) && (
                            <div className="text-[10px] text-secondary/40 uppercase tracking-widest">Pas de matchs à venir</div>
                        )}
                    </div>

                    <button className="flex-shrink-0 bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2">
                        Programme complet des matchs
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
