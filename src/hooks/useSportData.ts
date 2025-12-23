import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher, SPORT_API_BASE, ApiResponse, Match, StandingRow, Score } from '@/lib/api';

export function useLiveMatches() {
    // Poll every 2 seconds for live data from our internal API
    const { data, error, isLoading } = useSWR<ApiResponse<any[]>>(
        '/api/matches?type=live',
        fetcher,
        { refreshInterval: 2000 }
    );

    const matchesResult = useMemo(() => {
        if (!Array.isArray(data?.data)) return [];

        // Map API-Football structure
        const footballMatches = data.data.map((m: any) => ({
            id: String(m.fixture.id),
            title: `${m.teams.home.name} vs ${m.teams.away.name}`,
            league: m.league.name?.toUpperCase(),
            country: m.league.country,
            countryCode: m.league.flag,
            status: m.fixture.status.short,
            startTime: m.fixture.date,
            start_time: m.fixture.date,

            home_team: m.teams.home.name,
            away_team: m.teams.away.name,
            home_badge: m.teams.home.logo,
            away_badge: m.teams.away.logo,
            home_score: m.goals.home ?? 0,
            away_score: m.goals.away ?? 0,

            homeTeam: {
                id: String(m.teams.home.id),
                name: m.teams.home.name,
                badge: m.teams.home.logo,
                score: m.goals.home ?? 0
            },
            awayTeam: {
                id: String(m.teams.away.id),
                name: m.teams.away.name,
                badge: m.teams.away.logo,
                score: m.goals.away ?? 0
            },

            timer: m.fixture.status.elapsed ? `${m.fixture.status.elapsed}'` : undefined
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
            const leagueName = match.league?.toUpperCase() || '';
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

export function useUpcomingMatches() {
    // Fetch from internal optimized API (API-Football data via cache)
    const { data: sportData, error: sportError, isLoading: sportLoading } = useSWR<ApiResponse<any[]>>(
        '/api/matches?type=scheduled',
        fetcher,
        { refreshInterval: 10000 }
    );

    // Westream API fetch
    const { data: westreamData, error: westreamError, isLoading: westreamLoading } = useSWR<any[]>(
        `${WESTREAM_API_BASE}/matches/live`,
        (url) => fetch(url).then(r => r.json()),
        { refreshInterval: 10000 }
    );

    // Combine and Map Data
    const matches = useMemo(() => {
        const results: Match[] = [];
        const sportMatchesMap = new Map<string, Match>();

        // 1. Process Internal API Data (API-Football)
        // API-Football Structure: { fixture: {}, league: {}, teams: {}, goals: {}, score: {} }
        if (Array.isArray(sportData?.data)) {
            sportData.data.forEach((m: any) => {
                const matchObj: Match = {
                    id: String(m.fixture.id),
                    title: `${m.teams.home.name} vs ${m.teams.away.name}`,
                    league: m.league.name?.toUpperCase(),
                    country: m.league.country,
                    countryCode: m.league.flag, // or map to code
                    status: m.fixture.status.short, // 'NS', '1H', 'FT' etc
                    startTime: m.fixture.date,
                    start_time: m.fixture.date,

                    home_team: m.teams.home.name,
                    away_team: m.teams.away.name,
                    home_badge: m.teams.home.logo,
                    away_badge: m.teams.away.logo,

                    home_score: m.goals.home ?? 0,
                    away_score: m.goals.away ?? 0,

                    homeTeam: {
                        id: String(m.teams.home.id),
                        name: m.teams.home.name,
                        badge: m.teams.home.logo,
                        score: m.goals.home ?? 0
                    },
                    awayTeam: {
                        id: String(m.teams.away.id),
                        name: m.teams.away.name,
                        badge: m.teams.away.logo,
                        score: m.goals.away ?? 0
                    },

                    timer: m.fixture.status.elapsed ? `${m.fixture.status.elapsed}'` : undefined,
                    sources: []
                };

                results.push(matchObj);

                // Index for fuzzy matching
                const key = `${matchObj.home_team?.toLowerCase()}|${matchObj.away_team?.toLowerCase()}`;
                sportMatchesMap.set(key, matchObj);
            });
        }

        // 2. Process Westream Data (Secondary Source + Streaming Links)
        if (westreamData && Array.isArray(westreamData)) {
            westreamData.forEach((m: any) => {
                const cat = m.category?.toLowerCase() || '';
                const isFootball = cat === 'football' || cat === 'soccer';
                if (!isFootball) return;

                const homeName = m.teams?.home?.name || 'Home';
                const awayName = m.teams?.away?.name || 'Away';

                // Fuzzy match attempt
                const key = `${homeName.toLowerCase()}|${awayName.toLowerCase()}`;
                const existingMatch = sportMatchesMap.get(key);

                if (existingMatch) {
                    // Enrich with sources
                    if (m.sources && m.sources.length > 0) {
                        existingMatch.sources = m.sources;
                    }
                } else {
                    // Fallback for matches NOT in API-Football (Westream exclusives?)
                    results.push({
                        id: m.id,
                        league: m.category?.toUpperCase() || 'FOOTBALL',
                        country: 'Global',
                        countryCode: 'world',
                        title: m.title,
                        status: 'LIVE',
                        startTime: new Date(m.date).toISOString(),
                        homeTeam: {
                            id: '',
                            name: homeName,
                            score: m.home_score ?? 0,
                            badge: m.teams?.home?.badge
                        },
                        awayTeam: {
                            id: '',
                            name: awayName,
                            score: m.away_score ?? 0,
                            badge: m.teams?.away?.badge
                        },
                        home_team: homeName,
                        away_team: awayName,
                        home_badge: m.teams?.home?.badge,
                        away_badge: m.teams?.away?.badge,
                        home_score: m.home_score,
                        away_score: m.away_score,
                        start_time: new Date(m.date).toISOString(),
                        sources: m.sources,
                        timer: m.time || m.timer
                    });
                }
            });
        }

        return results.sort((a, b) => new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime());
    }, [sportData, westreamData]);

    return {
        matches,
        isLoading: sportLoading || westreamLoading,
        isError: sportError || westreamError
    };
}

export function useStandings(league: string = 'PL') {
    const { data, error, isLoading } = useSWR<any>(
        league ? `/api/standings?league=${league}` : null,
        fetcher,
        { refreshInterval: 600000 }
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
                name: row.team.name,
                badge: row.team.logo
            },
            played: row.all.played,
            won: row.all.win,
            drawn: row.all.draw,
            lost: row.all.lose,
            goals_for: row.all.goals.for,
            goals_against: row.all.goals.against,
            points: row.points,
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
    // Fetch from internal API route
    const { data, error, isLoading } = useSWR<any>(
        id ? `/api/match/${id}` : null,
        fetcher,
        { refreshInterval: 10000 }
    );

    // Also fetch from westream.su to get streaming sources
    const { data: westreamData } = useSWR<any[]>(
        'https://westream.su/matches/live',
        fetcher,
        { refreshInterval: 10000 }
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
            league: apiMatch.league.name,
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

            // Map events to our format
            events: events?.map((e: any) => ({
                time: e.time.elapsed ? `${e.time.elapsed}'` : '0',
                type: e.type === 'Goal' ? 'goal' : e.type === 'Card' ? 'card' : e.type === 'subst' ? 'sub' : 'status',
                team: e.team.id === apiMatch.teams.home.id ? 'home' : 'away',
                player: e.player.name,
                assist: e.assist?.name,
                cardType: e.detail?.includes('Yellow') ? 'yellow' : e.detail?.includes('Red') ? 'red' : undefined
            })) || []
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
            sources: sources && sources.length > 0 ? sources : []
        };
    }, [id, data, westreamData]);

    return {
        match: matchData,
        isLoading,
        isError: error
    };
}

export function useScores(league: string = 'PL') {
    // Poll for scores
    const { data, error, isLoading } = useSWR<ApiResponse<Score[]>>(
        `${SPORT_API_BASE}?data=results&category=scores&league=${league}`,
        fetcher,
        { refreshInterval: 15000 }
    );

    return {
        scores: Array.isArray(data?.data) ? data.data : [],
        isLoading,
        isError: error
    };
}
