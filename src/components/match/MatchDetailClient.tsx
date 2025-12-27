'use client'

import { useMatchDetail, useLiveMatches, useUpcomingMatches } from '@/hooks/useSportData'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import MatchHeader from '@/components/match/MatchHeader'
import MatchTabs, { ClassificationTab } from '@/components/match/MatchTabs'

interface MatchDetailClientProps {
    id: string;
}

export default function MatchDetailClient({ id }: MatchDetailClientProps) {
    // Get detail data
    const { match: detailMatch, isLoading: isDetailLoading, isError: isDetailError } = useMatchDetail(id);

    // Get live data to try and find scores if not in detail
    const { matches: liveMatches, isLoading: isLiveLoading } = useLiveMatches();
    const liveMatch = liveMatches?.find(m => m.id === id || (detailMatch && detailMatch.homeTeam?.name === m.home_team && detailMatch.awayTeam?.name === m.away_team));

    // Get upcoming/mock data as another fallback
    const { matches: upcomingMatches, isLoading: isUpcomingLoading } = useUpcomingMatches();
    const upcomingMatch = upcomingMatches?.find(m => m.id === id || (detailMatch && detailMatch.homeTeam?.name === m.home_team && detailMatch.awayTeam?.name === m.away_team));

    // Determine the match to display (detail preferred, live/upcoming as fallback)
    const matchFallback = liveMatch || upcomingMatch;

    // Fix: Ensure detailMatch is a valid object with an ID, not an empty array or null
    const validDetail = detailMatch && !Array.isArray(detailMatch) && (detailMatch as any).id === id ? detailMatch : null;

    const match = validDetail || (matchFallback ? {
        id: matchFallback.id,
        title: (matchFallback as any).title || `${matchFallback.home_team} vs ${matchFallback.away_team}`,
        // Map simplified structure to expected full structure if needed
        homeTeam: { name: matchFallback.home_team, badge: matchFallback.home_badge },
        awayTeam: { name: matchFallback.away_team, badge: matchFallback.away_badge },
        home_team: matchFallback.home_team,
        away_team: matchFallback.away_team,
        home_badge: matchFallback.home_badge,
        away_badge: matchFallback.away_badge,
        home_score: matchFallback.home_score,
        away_score: matchFallback.away_score,
        timer: matchFallback.timer,
        league: matchFallback.league,
        startTime: matchFallback.startTime || matchFallback.start_time,

        video_url: (matchFallback as any).video_url || (matchFallback as any).sources?.[0]?.url || `https://westream.su/embed/${matchFallback.id}`,
        status: matchFallback.status,
        sources: (matchFallback as any).sources,
        events: (matchFallback as any).events
    } : null);



    const isLoading = isDetailLoading && !match;

    // Loading State
    if (isLoading && !match) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-accent-cyan animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-accent-purple/50 border-t-transparent animate-spin-reverse opacity-50"></div>
                </div>
            </div>
        )
    }

    // Error State - Only show error if we really have no data at all
    if (!match && !isDetailLoading && !isLiveLoading && !isUpcomingLoading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 animate-pulse">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Match Non Trouvé</h1>
                <p className="text-secondary max-w-md mb-8">Nous n'avons pas pu charger les détails de ce match. Il a peut-être été supprimé ou n'existe pas.</p>
                <Link href="/" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-lg shadow-white/10">
                    Retour à l'Accueil
                </Link>
            </div>
        )
    }

    if (!match) return null;

    return (
        <main className="min-h-screen bg-[#0f0f0f] pb-20 selection:bg-accent-cyan/30 text-white font-sans">
            {/* Top Navigation / Breadcrumb */}
            <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Retour aux Matchs</span>
                </Link>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Match Details (Main Card) */}
                <div className="lg:col-span-2 space-y-6">
                    <MatchHeader
                        match={match as any}
                        homeScore={match.home_score}
                        awayScore={match.away_score}
                        liveTime={match.timer}
                    />

                    {/* Tabs / Streaming Area */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
                        <MatchTabs
                            match={match}
                            videoUrl={(match as any).video_url}
                            matchTitle={match.title}
                        />
                    </div>
                    <div className="px-2 py-4">
                        <span className="text-[10px] text-secondary font-medium uppercase tracking-widest opacity-40 italic">Heure d'Afrique centrale</span>
                    </div>
                </div>

                {/* Right Column - Sidebar (Standings & Social) */}
                <div className="space-y-6">
                    {/* Standings Card */}
                    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-1 overflow-hidden shadow-xl ring-1 ring-white/[0.02]">
                        <div className="px-5 py-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-lg text-white">Classement</h3>
                                <span className="text-[10px] text-secondary/60">
                                    {(match.league as any)?.name || (typeof match.league === 'string' ? match.league : '') || 'Compétition'}
                                    {(match.league as any)?.year && ` - ${(match.league as any).year}`}
                                </span>
                            </div>
                            <Link href="#" className="text-secondary hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>
                            </Link>
                        </div>
                        <div className="p-0">
                            <ClassificationTab match={match} />
                        </div>
                    </div>

                    {/* Social/News Card */}
                    <div className="bg-[#1c222e] rounded-2xl border border-white/5 p-5 shadow-xl transition-all hover:ring-1 hover:ring-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/10 overflow-hidden">
                                    <img src="https://abs.twimg.com/responsive-web/client-web/icon-ios.b1fc727a.png" className="w-full h-full object-cover" alt="X" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-bold text-sm text-white">mauritaniefoot</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-secondary">
                                        <span>X</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-[10px] font-bold text-red-500 animate-pulse">
                                LIVE
                            </div>
                        </div>
                        <p className="text-sm text-gray-200 leading-relaxed font-medium">
                            {match.home_team} vs {match.away_team} ! Le match est lancé ! 🔥 #{match.home_team?.replace(/\s/g, '')} #{match.away_team?.replace(/\s/g, '')} #Football
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">il y a quelques instants</span>
                            <div className="flex items-center gap-3 opacity-40">
                                <span className="text-[10px]">💬 12</span>
                                <span className="text-[10px]">🔄 45</span>
                                <span className="text-[10px]">❤️ 128</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
