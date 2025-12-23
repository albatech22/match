'use client'

import { useMatchDetail, useLiveMatches, useUpcomingMatches } from '@/hooks/useSportData'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import MatchHeader from '@/components/match/MatchHeader'
import MatchTabs from '@/components/match/MatchTabs'

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
        <main className="min-h-screen bg-black pb-20 selection:bg-accent-cyan/30">
            {/* Match Header with Scores */}
            <MatchHeader
                match={match as any}
                homeScore={match.home_score}
                awayScore={match.away_score}
                liveTime={match.timer} // Pass the timer directly, let Header decide if it shows based on status
            />

            {/* Dense Tabbed Content */}
            <MatchTabs
                match={match}
                videoUrl={(match as any).video_url}
                matchTitle={match.title}
            />

        </main>
    )
}
