
const API_KEY = 'f8a66fd6984937cabf1fc9997da1216d14f041ca14dbe233d87df2b714b830af';
const BASE_URL = 'https://apiv3.apifootball.com';

// NO CACHE - Always fetch fresh data for real-time updates
export async function fetchWithCache(url: string, ttlSeconds: number = 0) {
    try {
        const fullUrl = `${BASE_URL}/${url}&APIkey=${API_KEY}`;

        console.log(`[API-FOOTBALL] Fetching fresh data (NO CACHE): ${url}`);

        const res = await fetch(fullUrl, {
            cache: 'no-store', // Disable Next.js cache
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[API-FOOTBALL] Error: ${res.status} - ${errorText}`);
            throw new Error(`API Error: ${res.status} - ${errorText}`);
        }

        const data = await res.json();

        // Handle error messages from API (sometimes returns { error: ... } even with 200 OK)
        if (data && data.error) {
            console.error(`[API-FOOTBALL] API returned error:`, data.error);
            return null;
        }

        console.log(`[API-FOOTBALL] Successfully fetched fresh data`);
        return data;

    } catch (error) {
        console.error(`[API-FOOTBALL] Fetch error:`, error);
        throw error;
    }
}

// Map apifootball.com structure to our internal API-Football structure
function mapMatch(m: any) {
    if (!m) return null;

    // Enhanced status mapping
    let statusShort = 'NS';
    let elapsed = undefined;

    if (m.match_status === 'Finished') {
        statusShort = 'FT';
    } else if (m.match_status === 'Half Time' || m.match_status === 'Halftime') {
        statusShort = 'HT';
        elapsed = 45;
    } else if (m.match_status && m.match_status.includes('Pen')) {
        statusShort = 'PEN';
        elapsed = 120;
    } else if (m.match_live === '1') {
        // Match is live
        statusShort = 'LIVE';

        // Try to extract minutes from match_status if it contains numbers
        if (m.match_status && typeof m.match_status === 'string') {
            const minuteMatch = m.match_status.match(/(\d+)/);
            if (minuteMatch) {
                elapsed = parseInt(minuteMatch[1]);
            }
        }

        // If no elapsed time found, estimate based on status text
        if (!elapsed) {
            const status = (m.match_status || '').toLowerCase();
            if (status.includes('1st') || status.includes('first')) {
                elapsed = 25; // Mid first half
            } else if (status.includes('2nd') || status.includes('second')) {
                elapsed = 70; // Mid second half
            } else if (status.includes('extra')) {
                elapsed = 100; // Extra time
            }
        }
    } else {
        statusShort = m.match_status || 'NS';
    }

    return {
        fixture: {
            id: m.match_id || '',
            date: m.match_date && m.match_time ? `${m.match_date}T${m.match_time}:00Z` : new Date().toISOString(),
            status: {
                short: statusShort,
                long: m.match_status || statusShort,
                elapsed: elapsed
            },
            venue: {
                name: m.match_stadium || '',
                city: ''
            },
            referee: m.match_referee || ''
        },
        league: {
            id: m.league_id ? (typeof m.league_id === 'string' ? parseInt(m.league_id) : m.league_id) : 0,
            name: m.league_name || 'Unknown League',
            country: m.country_name || '',
            logo: m.league_logo || '',
            flag: m.country_logo || '',
            year: m.league_year || '',
            stage: m.stage_name || '',
            round: m.match_round || ''
        },
        teams: {
            home: {
                id: m.match_hometeam_id || '',
                name: m.match_hometeam_name || 'Home Team',
                logo: m.team_home_badge || ''
            },
            away: {
                id: m.match_awayteam_id || '',
                name: m.match_awayteam_name || 'Away Team',
                logo: m.team_away_badge || ''
            }
        },
        goals: {
            home: parseInt(m.match_hometeam_score) || 0,
            away: parseInt(m.match_awayteam_score) || 0
        },
        // Extra info for details
        cards: m.cards || [],
        goalscorer: m.goalscorer || [],
        substitutions: m.substitutions || {},
        lineups: m.lineup || null,
        statistics: m.statistics || []
    };
}

export async function getLiveMatches() {
    const data = await fetchWithCache('?action=get_events&match_live=1', 0); // No cache for live data
    if (!Array.isArray(data)) return { response: [] };
    return { response: data.map(mapMatch).filter(m => m !== null) };
}

export async function getFixtures(date: string) {
    const data = await fetchWithCache(`?action=get_events&from=${date}&to=${date}`, 0); // No cache for real-time updates
    if (!Array.isArray(data)) return { response: [] };
    return { response: data.map(mapMatch).filter(m => m !== null) };
}

export async function getLeagueStandings(leagueId: number, season: number = 2024) {
    const data = await fetchWithCache(`?action=get_standings&league_id=${leagueId}`, 0); // No cache for real-time updates
    if (!Array.isArray(data)) return { response: [] };

    // Map apifootball.com standings to our expected structure
    const mapped = data.map((s: any) => ({
        rank: parseInt(s.overall_league_position),
        team: {
            id: s.team_id,
            name: s.team_name,
            logo: s.team_badge
        },
        points: parseInt(s.overall_league_PTS),
        goalsDiff: parseInt(s.overall_league_GF) - parseInt(s.overall_league_GA),
        all: {
            played: parseInt(s.overall_league_payed),
            win: parseInt(s.overall_league_W),
            draw: parseInt(s.overall_league_D),
            lose: parseInt(s.overall_league_L),
            goals: {
                for: parseInt(s.overall_league_GF),
                against: parseInt(s.overall_league_GA)
            }
        }
    }));

    return {
        response: [{
            league: {
                standings: [mapped]
            }
        }]
    };
}

export async function getMatchDetails(fixtureId: string) {


    try {
        const data = await fetchWithCache(`?action=get_events&match_id=${fixtureId}`, 0); // No cache for real-time updates



        if (!data || !Array.isArray(data) || data.length === 0) {

            return { response: [] };
        }

        const match = data[0];


        if (!match || !match.match_id) {

            return { response: [] };
        }


        const mapped = mapMatch(match);


        // Format events for detail view - with null safety
        const events = [];

        if (Array.isArray(match.goalscorer)) {

            events.push(...match.goalscorer.map((g: any) => ({
                time: { elapsed: parseInt(g.time) || 0 },
                team: { id: g.home_scorer ? match.match_hometeam_id : match.match_awayteam_id },
                player: { name: g.home_scorer || g.away_scorer || 'Unknown' },
                assist: { name: g.home_assist || g.away_assist || '' },
                type: 'Goal',
                detail: 'Normal Goal'
            })));
        }

        if (Array.isArray(match.cards)) {

            events.push(...match.cards.map((c: any) => {
                // Normalize card type - ensure it's properly formatted
                let cardDetail = c.card || 'yellow card';
                const cardLower = cardDetail.toLowerCase();

                // Standardize card detail format
                if (cardLower.includes('yellow') || cardLower.includes('jaune')) {
                    cardDetail = 'Yellow Card';
                } else if (cardLower.includes('red') || cardLower.includes('rouge')) {
                    cardDetail = 'Red Card';
                }

                return {
                    time: { elapsed: parseInt(c.time) || 0 },
                    team: { id: c.home_fault ? match.match_hometeam_id : match.match_awayteam_id },
                    player: { name: c.home_fault || c.away_fault || 'Unknown' },
                    type: 'Card',
                    detail: cardDetail
                };
            }));
        }


        return {
            response: [mapped],
            events: events,
            lineups: match.lineup || null,
            statistics: match.statistics || []  // Add statistics here
        };
    } catch (error) {

        return { response: [] };
    }
}

export async function getTeamFixtures(teamId: number, last: number = 5, next: number = 5) {
    // Get past and future fixtures for a team
    // For simplicity, we just fetch a range around today
    const now = new Date();
    const from = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const to = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const data = await fetchWithCache(`?action=get_events&team_id=${teamId}&from=${from}&to=${to}`, 0); // No cache for real-time updates
    if (!Array.isArray(data)) return { response: [] };
    return { response: data.map(mapMatch).filter(m => m !== null) };
}

export async function getMatchVideos(matchId: string) {


    try {
        const data = await fetchWithCache(`?action=get_videos&match_id=${matchId}`, 0); // No cache for real-time updates



        if (!data || !Array.isArray(data)) {

            return { response: [] };
        }

        // Map video data to our format
        const videos = data.map((v: any) => ({
            match_id: v.match_id,
            title: v.video_title || v.video_title_full || 'Highlights',
            url: v.video_url,
            thumbnail: v.video_thumbnail || null
        }));


        return { response: videos };

    } catch (error) {

        return { response: [] };
    }
}
