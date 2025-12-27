import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, ApiResponse, Match, StandingRow, Score } from '@/lib/api';
import { getLocalDateString } from '@/lib/utils';

export function useLiveMatches() {
    // Poll every 10 seconds for real-time live data - NO CACHE
    const { data, error, isLoading } = useSWR<ApiResponse<any[]>>(
        '/api/matches?type=live',
        fetcher,
        {
            refreshInterval: 10000,        // Refresh every 10 seconds
            revalidateOnFocus: true,       // Refresh when user returns to tab
            revalidateOnReconnect: true,   // Refresh when connection restored
            dedupingInterval: 0,           // No deduplication - always fetch
            revalidateIfStale: true,       // Always revalidate stale data
            shouldRetryOnError: true       // Retry on error
        }
    );

    const matchesResult = useMemo(() => {
        if (!Array.isArray(data?.data)) return [];

        // Map API-Football structure
        const footballMatches = data.data.map((m: any) => ({
            id: String(m.fixture?.id || Math.random()),
            title: `${m.teams?.home?.name || 'Unknown'} vs ${m.teams?.away?.name || 'Unknown'}`,
            league: {
                id: m.league?.id,
                name: m.league?.name?.toUpperCase(),
                country: m.league?.country,
                logo: m.league?.logo,
                flag: m.league?.flag
            },
            country: m.league?.country,
            countryCode: m.league?.flag,
            status: m.fixture?.status?.short || 'NS',
            startTime: m.fixture?.date,
            start_time: m.fixture?.date,

            home_team: m.teams?.home?.name,
            away_team: m.teams?.away?.name,
            home_badge: m.teams?.home?.logo,
            away_badge: m.teams?.away?.logo,
            home_score: m.goals?.home ?? 0,
            away_score: m.goals?.away ?? 0,

            homeTeam: {
                id: String(m.teams?.home?.id || ''),
                name: m.teams?.home?.name || 'Unknown',
                badge: m.teams?.home?.logo,
                score: m.goals?.home ?? 0
            },
            awayTeam: {
                id: String(m.teams?.away?.id || ''),
                name: m.teams?.away?.name || 'Unknown',
                badge: m.teams?.away?.logo,
                score: m.goals?.away ?? 0
            },

            timer: m.fixture?.status?.elapsed ? `${m.fixture?.status?.elapsed}′` : undefined
        }));

        // Priority ranking for leagues
        const leaguePriority: Record<string, number> = {
            'PREMIER LEAGUE': 10,
            'UEFA CHAMPIONS LEAGUE': 9,
            'LA LIGA': 8,
            'SERIE A': 7,
            'BUNDESLIGA': 6,
            'LIGUE 1': 5,
        };

        // Helper to calc priority score
        const getPriority = (match: any) => {
            let score = 0;
            const leagueName = match.league?.name?.toUpperCase() || match.league?.toUpperCase() || '';
            if (leaguePriority[leagueName]) score += leaguePriority[leagueName];

            // Live matches get highest priority
            if (match.status !== 'NS' && match.status !== 'FT') score += 20;
            if (match.status === 'FT') score += 5;

            // Boost known big teams slightly
            const bigTeams = ['Man Utd', 'Man City', 'Liverpool', 'Arsenal', 'Chelsea', 'Real Madrid', 'Barcelona', 'Bayern', 'PSG'];
            if (bigTeams.some(t => match.home_team?.includes(t) || match.away_team?.includes(t))) score += 5;
            return score;
        };

        return [...footballMatches].sort((a, b) => {
            const scoreA = getPriority(a);
            const scoreB = getPriority(b);
            if (scoreA !== scoreB) return scoreB - scoreA;
            return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
        });

    }, [data]);

    return {
        matches: matchesResult,
        isLoading,
        isError: error
    };
}

export const WESTREAM_API_BASE = 'https://westream.su';

export function useUpcomingMatches(date?: string) {
    // Determine the query date - importance of client-side date for timezone alignment
    const queryDate = date || getLocalDateString();

    // Fetch from internal API - NO CACHE, real-time updates
    const { data: sportData, error: sportError, isLoading: sportLoading } = useSWR<ApiResponse<any[]>>(
        `/api/matches?type=scheduled&date=${queryDate}`,
        fetcher,
        {
            refreshInterval: 10000,        // Refresh every 10 seconds
            revalidateOnFocus: true,       // Refresh when user returns to tab
            revalidateOnReconnect: true,   // Refresh when connection restored
            dedupingInterval: 0,           // No deduplication - always fetch
            revalidateIfStale: true,       // Always revalidate stale data
            shouldRetryOnError: true       // Retry on error
        }
    );

    // Westream API fetch for streaming links ONLY - real-time updates
    const { data: westreamData, isLoading: westreamLoading } = useSWR<any[]>(
        `${WESTREAM_API_BASE}/matches/live`,
        (url) => fetch(url).then(r => r.json()),
        {
            refreshInterval: 10000,        // Refresh every 10 seconds
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 0,
            revalidateIfStale: true,
            shouldRetryOnError: true
        }
    );

    // Map Data without fallbacks
    const matches = useMemo(() => {
        if (!Array.isArray(sportData?.data)) return [];

        return sportData.data.map((m: any) => {
            const matchObj: Match = {
                id: String(m.fixture?.id || Math.random()),
                title: `${m.teams?.home?.name || 'Unknown'} vs ${m.teams?.away?.name || 'Unknown'}`,
                league: {
                    id: m.league?.id,
                    name: m.league?.name?.toUpperCase(),
                    country: m.league?.country,
                    logo: m.league?.logo,
                    flag: m.league?.flag
                },
                country: m.league?.country,
                countryCode: m.league?.flag,
                status: m.fixture?.status?.short || 'NS', // 'NS', '1H', 'FT' etc
                startTime: m.fixture?.date,
                start_time: m.fixture?.date,

                home_team: m.teams?.home?.name,
                away_team: m.teams?.away?.name,
                home_badge: m.teams?.home?.logo,
                away_badge: m.teams?.away?.logo,

                home_score: m.goals?.home ?? 0,
                away_score: m.goals?.away ?? 0,

                homeTeam: {
                    id: String(m.teams?.home?.id || ''),
                    name: m.teams?.home?.name || 'Unknown',
                    badge: m.teams?.home?.logo,
                    score: m.goals?.home ?? 0
                },
                awayTeam: {
                    id: String(m.teams?.away?.id || ''),
                    name: m.teams?.away?.name || 'Unknown',
                    badge: m.teams?.away?.logo,
                    score: m.goals?.away ?? 0
                },

                timer: m.fixture?.status?.elapsed ? `${m.fixture?.status?.elapsed}′` : undefined,
                sources: []
            };

            // Enrichment with Westream sources ONLY if it's a match
            if (westreamData && Array.isArray(westreamData)) {
                const westreamMatch = westreamData.find((wm: any) => {
                    if (!wm || wm.category?.toLowerCase() !== 'football') return false;
                    const title = (wm.title || '').toLowerCase();
                    const home = matchObj.home_team?.toLowerCase();
                    const away = matchObj.away_team?.toLowerCase();
                    return home && away && title.includes(home) && title.includes(away);
                });
                if (westreamMatch?.sources) {
                    matchObj.sources = westreamMatch.sources;
                }
            }

            return matchObj;
        }).sort((a, b) => new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime());
    }, [sportData, westreamData]);

    return {
        matches,
        isLoading: sportLoading || westreamLoading,
        isError: sportError
    };
}

export function useStandings(league: string = 'PL', leagueId?: number) {
    const query = leagueId ? `leagueId=${leagueId}` : `league=${league}`;
    const { data, error, isLoading } = useSWR<any>(
        league || leagueId ? `/api/standings?${query}` : null,
        fetcher,
        {
            refreshInterval: 10000,        // Refresh every 10 seconds for real-time standings
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 0,
            revalidateIfStale: true,
            shouldRetryOnError: true
        }
    );

    const standingsData = useMemo(() => {
        if (!data?.success || !data?.data?.[0]?.league?.standings) return [];

        // API-Football returns standings grouped (sometimes multiple groups)
        // We'll take the first standings array
        const standings = data.data[0].league.standings[0];

        if (!Array.isArray(standings)) return [];

        // Map to our StandingRow interface
        return standings.map((row: any) => ({
            position: row.rank,
            team: {
                name: row.team?.name || 'Unknown',
                badge: row.team?.logo
            },
            played: row.all?.played ?? 0,
            won: row.all?.win ?? 0,
            drawn: row.all?.draw ?? 0,
            lost: row.all?.lose ?? 0,
            goals_for: row.all?.goals?.for ?? 0,
            goals_against: row.all?.goals?.against ?? 0,
            points: row.points ?? 0,
            form: row.form || ''
        }));
    }, [data]);

    return {
        standings: standingsData,
        isLoading,
        isError: error
    };
}

export function useMatchDetail(id: string) {
    // Fetch from internal API route - real-time updates
    const { data, error, isLoading } = useSWR<any>(
        id ? `/api/match/${id}` : null,
        fetcher,
        {
            refreshInterval: 10000,        // Refresh every 10 seconds
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 0,
            revalidateIfStale: true,
            shouldRetryOnError: true
        }
    );

    // Also fetch from westream.su to get streaming sources - real-time updates
    const { data: westreamData } = useSWR<any[]>(
        'https://westream.su/matches/live',
        fetcher,
        {
            refreshInterval: 10000,
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 0,
            revalidateIfStale: true,
            shouldRetryOnError: true
        }
    );

    const matchData = useMemo(() => {
        if (!data?.success || !data?.data?.response?.[0]) return null;

        const apiMatch = data.data.response[0];
        const lineups = data.data.lineups;
        const events = data.data.events;

        // Map API-Football structure to our Match interface
        const matchDetail = {
            id: String(apiMatch.fixture.id),
            title: `${apiMatch.teams.home.name} vs ${apiMatch.teams.away.name}`,
            league: {
                id: apiMatch.league.id,
                name: apiMatch.league.name,
                country: apiMatch.league.country,
                logo: apiMatch.league.logo,
                flag: apiMatch.league.flag,
                year: apiMatch.league.year,
                stage: apiMatch.league.stage,
                round: apiMatch.league.round
            },
            country: apiMatch.league.country,
            countryCode: apiMatch.league.flag,
            status: apiMatch.fixture.status.short,
            startTime: apiMatch.fixture.date,
            start_time: apiMatch.fixture.date,

            home_team: apiMatch.teams.home.name,
            away_team: apiMatch.teams.away.name,
            home_badge: apiMatch.teams.home.logo,
            away_badge: apiMatch.teams.away.logo,
            home_score: apiMatch.goals.home ?? 0,
            away_score: apiMatch.goals.away ?? 0,

            homeTeam: {
                id: String(apiMatch.teams.home.id),
                name: apiMatch.teams.home.name,
                badge: apiMatch.teams.home.logo,
                score: apiMatch.goals.home ?? 0
            },
            awayTeam: {
                id: String(apiMatch.teams.away.id),
                name: apiMatch.teams.away.name,
                badge: apiMatch.teams.away.logo,
                score: apiMatch.goals.away ?? 0
            },

            timer: apiMatch.fixture.status.elapsed ? `${apiMatch.fixture.status.elapsed}'` : undefined,
            stadium: apiMatch.fixture.venue?.name,
            referee: apiMatch.fixture.referee,

            // Add lineups if available
            lineups: lineups,

            // Add statistics if available
            statistics: data.data.statistics || [],

            // Map events to our format
            events: events?.map((e: any) => {
                // Improved card type detection
                let cardType: 'yellow' | 'red' | undefined = undefined;
                if (e.type === 'Card' && e.detail) {
                    const detail = e.detail.toLowerCase();
                    if (detail.includes('yellow') || detail.includes('jaune')) {
                        cardType = 'yellow';
                    } else if (detail.includes('red') || detail.includes('rouge')) {
                        cardType = 'red';
                    }
                }

                return {
                    time: e.time.elapsed ? `${e.time.elapsed}'` : '0',
                    type: e.type === 'Goal' ? 'goal' : e.type === 'Card' ? 'card' : e.type === 'subst' ? 'sub' : 'status',
                    team: e.team.id === apiMatch.teams.home.id ? 'home' : 'away',
                    player: e.player.name,
                    assist: e.assist?.name,
                    cardType: cardType
                };
            }) || []
        };

        // Try to find streaming sources from westream for this match
        let sources: any[] | undefined;
        if (westreamData && Array.isArray(westreamData)) {
            const westreamMatch = westreamData.find((m: any) => {
                if (!m || m.category?.toLowerCase() !== 'football') return false;
                const title = (m.title || '').toLowerCase();
                const home = matchDetail.home_team.toLowerCase();
                const away = matchDetail.away_team.toLowerCase();
                if (home && away && title.includes(home) && title.includes(away)) return true;
                return false;
            });

            if (westreamMatch?.sources) {
                sources = westreamMatch.sources;
            }
        }

        return {
            ...matchDetail,
            sources: sources && sources.length > 0 ? sources : [],
            teamFixtures: (data.data as any).teamFixtures
        };
    }, [id, data, westreamData]);

    return {
        match: matchData,
        isLoading,
        isError: error
    };
}

export function useScores(league: string = 'PL') {
    // Scores now handled via live matches API-Football
    const { matches, isLoading, isError } = useLiveMatches();

    const scores = useMemo(() => {
        return matches.map(m => ({
            id: m.id,
            home: { name: m.home_team, score: m.home_score, badge: m.home_badge },
            away: { name: m.away_team, score: m.away_score, badge: m.away_badge },
            timer: m.timer,
            league: m.league,
            status: m.status
        }));
    }, [matches]);

    return {
        scores,
        isLoading,
        isError
    };
}

export function useMatchVideos(matchId: string) {
    const { data, error, isLoading } = useSWR<any>(
        matchId ? `/api/match/${matchId}/videos` : null,
        fetcher,
        {
            refreshInterval: 10000,        // Refresh every 10 seconds for consistency
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 0,
            revalidateIfStale: true,
            shouldRetryOnError: true
        }
    );

    const videos = useMemo(() => {
        if (!data?.success || !Array.isArray(data?.data)) return [];

        return data.data.map((v: any) => ({
            id: v.match_id,
            title: v.title || 'Highlights',
            url: v.url,
            thumbnail: v.thumbnail
        }));
    }, [data]);

    return {
        videos,
        isLoading,
        isError: error
    };
}

