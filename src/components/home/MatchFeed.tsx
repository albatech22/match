'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveMatches, useUpcomingMatches } from '@/hooks/useSportData';
import CompactMatchRow from '@/components/match/CompactMatchRow';
import { Filter, Calendar, ChevronDown } from 'lucide-react';

const tabs = [
    { id: 'all', label: 'Tout' },
    { id: 'live', label: 'En Direct' },
    { id: 'upcoming', label: 'À Venir' },
    { id: 'finished', label: 'Terminé' },
];

export default function MatchFeed() {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('upcoming');
    const { matches: liveMatches, isLoading: liveLoading } = useLiveMatches();
    const { matches: upcomingMatches, isLoading: upcomingLoading } = useUpcomingMatches();

    useEffect(() => {
        setMounted(true);
    }, []);

    const matches = activeTab === 'live' ? liveMatches :
        activeTab === 'upcoming' ? upcomingMatches :
            activeTab === 'all' ? [...(liveMatches || []), ...(upcomingMatches || [])] :
                []; // finished not implemented

    // ... (rest of logic)

    if (!mounted) {
        return <div className="min-h-[400px]"></div>; // Skeleton or empty
    }

    // Deduplicate
    const uniqueMatches = Array.from(new Map(matches?.map(m => [m.id, m])).values());

    // Helper function to get date label
    const getDateLabel = (date: Date): string => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const matchDate = new Date(date);
        matchDate.setHours(0, 0, 0, 0);

        const diffTime = matchDate.getTime() - today.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return "Demain";
        if (diffDays === 2) return "Après-demain";
        if (diffDays === -1) return "Hier";
        if (diffDays < -1 && diffDays >= -7) return "Cette semaine";

        // Return full date for other cases
        return matchDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };

    // Group by Date
    const groupedMatches = uniqueMatches.reduce((groups, match) => {
        const matchTime = new Date(match.start_time || match.startTime || 0);
        const dateLabel = matchTime.getTime() > 0 ? getDateLabel(matchTime) : "Date inconnue";

        if (!groups[dateLabel]) {
            groups[dateLabel] = {
                date: matchTime,
                matches: []
            };
        }
        groups[dateLabel].matches.push(match);
        return groups;
    }, {} as Record<string, { date: Date, matches: typeof uniqueMatches }>);

    // Sort groups by date
    const sortedGroups = Object.entries(groupedMatches).sort((a, b) => {
        return a[1].date.getTime() - b[1].date.getTime();
    });

    return (
        <section className="w-full max-w-[1000px] mx-auto px-0 md:px-4 pb-20">
            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-4 mb-4 px-4 sticky top-16 z-30 py-4 bg-black/95 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-accent-cyan text-black'
                                : 'bg-white/5 text-secondary hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                    <Calendar className="w-4 h-4" />
                </button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-6">
                {sortedGroups.map(([dateLabel, { matches: dateMatches }]) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        key={dateLabel}
                        className="bg-[#0f0f0f] md:rounded-xl overflow-hidden border-t md:border border-white/5"
                    >
                        {/* Date Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-accent-cyan" />
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{dateLabel}</h3>
                            </div>
                            <span className="text-xs text-secondary font-mono">{dateMatches.length} match{dateMatches.length > 1 ? 's' : ''}</span>
                        </div>

                        {/* Matches */}
                        <div>
                            {dateMatches.map((match) => {
                                const matchTime = new Date(match.start_time || match.startTime || 0).getTime();
                                const now = Date.now();

                                // Reliable status check based on API short codes
                                const rawStatus = match.status; // e.g. 'NS', 'FT', '1H', 'LIVE'
                                const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'BT', 'LIVE'].includes(rawStatus);
                                const isFinished = ['FT', 'AET', 'PEN'].includes(rawStatus);
                                const isUpcoming = ['NS', 'TBD', 'SUSP', 'PST', 'CANC', 'ABD'].includes(rawStatus);

                                // Fallback if status is unknown/missing, use time
                                const hasStartedByTime = now >= matchTime;
                                const effectiveStatus = isLive ? 'live' : (isFinished ? 'finished' : (isUpcoming ? 'upcoming' : (hasStartedByTime ? 'finished' : 'upcoming')));

                                const minutesUntilStart = Math.floor((matchTime - now) / 60000);

                                return (
                                    <CompactMatchRow
                                        key={match.id}
                                        id={match.id}
                                        homeTeam={match.home_team || 'Unknown'}
                                        awayTeam={match.away_team || 'Unknown'}
                                        homeBadge={match.home_badge}
                                        awayBadge={match.away_badge}
                                        matchDate={matchTime > 0 ? new Date(matchTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}
                                        time={effectiveStatus === 'live' ? 'LIVE' : new Date(matchTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        status={effectiveStatus}
                                        minutesUntilStart={effectiveStatus === 'upcoming' ? minutesUntilStart : undefined}
                                        homeScore={match.home_score}
                                        awayScore={match.away_score}
                                        timer={match.timer}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                ))}

                {sortedGroups.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-secondary text-sm font-mono">Aucun match trouvé.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
