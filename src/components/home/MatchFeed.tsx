'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveMatches, useUpcomingMatches } from '@/hooks/useSportData';
import MatchCard from '@/components/match/MatchCard';
import DateSelector from '@/components/home/DateSelector';
import { LayoutGrid, Clock, Star, ChevronRight, Filter, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getLocalDateString } from '@/lib/utils';

export default function MatchFeed({ mode = 'all' }: { mode?: 'all' | 'live' }) {
    const { matches: liveMatches, isLoading: liveLoading } = useLiveMatches();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [todayStr, setTodayStr] = useState('');

    const dateStr = getLocalDateString(selectedDate);
    const { matches: upcomingMatches, isLoading: upcomingLoading } = useUpcomingMatches(dateStr);

    useEffect(() => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        setTodayStr(now.toLocaleDateString('fr-FR', options));

        // Set initial selected date to today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setSelectedDate(today);
    }, []);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        // Update the display string
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        setTodayStr(date.toLocaleDateString('fr-FR', options));
    };

    const groupedMatches = useMemo(() => {
        const all = [...(liveMatches || []), ...(upcomingMatches || [])];

        // Deduplicate by ID
        const seen = new Set();
        const unique = all.filter(match => {
            if (seen.has(match.id)) return false;
            seen.add(match.id);
            return true;
        });

        // Get date range based on selected date
        const targetDate = selectedDate || new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Filter by mode and date
        const targetDateStr = getLocalDateString(selectedDate) || getLocalDateString(new Date());

        const filtered = unique.filter(m => {
            // Filter by mode (live or all)
            const modeFilter = mode === 'live'
                ? (m.status === 'LIVE' || m.status === '1H' || m.status === '2H' || m.status === 'HT')
                : true;

            if (!modeFilter) return false;

            // Filter by selected date (String comparison to avoid timezone shifts)
            const matchDateFull = m.startTime || m.start_time || (m as any).fixture?.date;
            if (!matchDateFull) return true;

            const matchDateStr = matchDateFull.split('T')[0];
            return matchDateStr === targetDateStr;
        });

        // Group by league
        const groups: { [key: string]: { league: any, matches: any[] } } = {};
        filtered.forEach(match => {
            const leagueId = typeof match.league === 'object' && match.league?.id ? match.league.id : 'other';
            if (!groups[leagueId]) {
                groups[leagueId] = {
                    league: match.league,
                    matches: []
                };
            }
            groups[leagueId].matches.push(match);
        });

        // Convert to array and sort with priority for AFCON until Jan 19, 2026
        const groupsArray = Object.values(groups);
        const now = new Date();
        const afconPriorityEnd = new Date('2026-01-19T23:59:59');

        groupsArray.sort((a, b) => {
            // If before Jan 19, 2025, prioritize AFCON
            if (now <= afconPriorityEnd) {
                const aIsAfcon = a.league?.name?.toUpperCase().includes('AFRICA CUP') ||
                    a.league?.name?.toUpperCase().includes('AFCON') ||
                    a.league?.name?.toUpperCase().includes('CAF');
                const bIsAfcon = b.league?.name?.toUpperCase().includes('AFRICA CUP') ||
                    b.league?.name?.toUpperCase().includes('AFCON') ||
                    b.league?.name?.toUpperCase().includes('CAF');

                if (aIsAfcon && !bIsAfcon) return -1;
                if (!aIsAfcon && bIsAfcon) return 1;
            }

            // Otherwise maintain original order
            return 0;
        });

        return groupsArray;
    }, [liveMatches, upcomingMatches, mode, selectedDate]);

    const isLoading = liveLoading || upcomingLoading;

    return (
        <section className="w-full max-w-[1200px] mx-auto pb-8">
            {/* Mobile Date Selector */}
            <div className="lg:hidden">
                <DateSelector
                    selectedDate={selectedDate || undefined}
                    onDateChange={handleDateChange}
                />
            </div>

            <div className="px-4 lg:px-10 py-8">
                {/* Breadcrumb / Status Line */}
                <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest mb-10">
                    <span className="font-bold">Kivu Stream</span>
                    <span className="text-white/10">/</span>
                    <span>Score en direct du {todayStr}</span>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-accent-cyan/20 border-t-accent-cyan rounded-full animate-spin"></div>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Chargement des matchs...</p>
                    </div>
                ) : groupedMatches.length > 0 ? (
                    <div className="flex flex-col gap-10">
                        {groupedMatches.map((group: any) => (
                            <div key={group.league?.id || 'other'} className="flex flex-col gap-4">
                                {/* League Header */}
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-4 bg-white/5 rounded-sm overflow-hidden flex items-center justify-center">
                                            {group.league?.logo ? (
                                                <img src={group.league.logo} className="w-full h-full object-contain" alt="" />
                                            ) : (
                                                <LayoutGrid className="w-3 h-3 text-white/20" />
                                            )}
                                        </div>
                                        <h2 className="text-sm md:text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                                            {group.league?.name || 'Autre Compétition'}
                                            <Star className="w-3.5 h-3.5 text-white/10 group-hover:text-accent-gold transition-colors cursor-pointer" />
                                        </h2>
                                    </div>
                                    <Link
                                        href={`/league/${group.league?.id || ''}`}
                                        className="text-[10px] font-bold text-white/30 hover:text-accent-cyan flex items-center gap-1 uppercase tracking-widest transition-colors"
                                    >
                                        Calendrier
                                        <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>

                                {/* Matches Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {group.matches.map((match: any) => {
                                        // Extract time from startTime or fixture.date
                                        let matchTime = '';
                                        const dateStr = match.startTime || match.start_time || match.fixture?.date;
                                        if (dateStr) {
                                            try {
                                                const date = new Date(dateStr);
                                                matchTime = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                                            } catch (e) {
                                                matchTime = match.time || '';
                                            }
                                        } else {
                                            matchTime = match.time || '';
                                        }

                                        return (
                                            <MatchCard
                                                key={match.id}
                                                id={match.id}
                                                homeTeam={match.home_team || match.homeTeam?.name}
                                                awayTeam={match.away_team || match.awayTeam?.name}
                                                homeBadge={match.home_badge || match.homeTeam?.logo}
                                                awayBadge={match.away_badge || match.awayTeam?.logo}
                                                homeScore={match.home_score ?? match.goals?.home}
                                                awayScore={match.away_score ?? match.goals?.away}
                                                status={match.status || match.fixture?.status?.short}
                                                time={matchTime}
                                                timer={match.timer || match.fixture?.status?.elapsed?.toString()}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                            <Clock className="w-8 h-8" />
                        </div>
                        <p className="text-white/20 text-sm font-bold uppercase tracking-widest">Aucun match en cours</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function ChevronDown({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    )
}
