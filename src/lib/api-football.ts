
// List of API Keys - Rotate through these to distribute load
// User provided: 771ea0a4d6f31df359106d6ce168cb22
const API_KEYS = [
    '771ea0a4d6f31df359106d6ce168cb22',
];

let currentKeyIndex = 0;

function getApiKey() {
    // Simple round-robin or random could work. 
    // For now, let's just pick one.
    // Ideally, we'd track usage per key, but that requires persistent storage.
    // Random distribution is good enough for stateless serverless functions if they spin up frequently,
    // but round-robin is better if the process stays alive.
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return key;
}

// Simple In-Memory Cache
interface CacheEntry {
    data: any;
    expiry: number;
}

const cache = new Map<string, CacheEntry>();

export async function fetchWithCache(endpoint: string, ttlSeconds: number) {
    const now = Date.now();
    const cacheKey = endpoint;
    const cached = cache.get(cacheKey);

    if (cached && cached.expiry > now) {
        console.log(`[CACHE HIT] ${endpoint}`);
        return cached.data;
    }

    console.log(`[CACHE MISS] ${endpoint}`);

    // Get a key
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('No API Key available');

    try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const res = await fetch(`https://v3.football.api-sports.io${endpoint}`, {
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io',
                'x-rapidapi-key': apiKey
            },
            signal: controller.signal,
            next: { revalidate: ttlSeconds } // Next.js fetch cache hint
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`API Error ${res.status}: ${errorText}`);
            // If rate limited (429), maybe try next key recursively? 
            // For simplicity, just throw for now.
            throw new Error(`API Error: ${res.status} - ${errorText}`);
        }

        const data = await res.json();

        // Save to memory cache
        cache.set(cacheKey, {
            data: data,
            expiry: now + (ttlSeconds * 1000)
        });

        return data;

    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.error('Fetch timeout:', endpoint);
            throw new Error('Request timeout - API took too long to respond');
        }
        console.error('Fetch error:', error);
        // Return stale data if available?
        if (cached) {
            console.log('[CACHE] Returning stale data due to error');
            return cached.data;
        }
        throw error;
    }
}

export async function getLiveMatches() {
    // Cache live matches for 2 minutes (120s)
    return fetchWithCache('/fixtures?live=all', 120);
}

export async function getFixtures(date: string) {
    // Cache daily fixtures for 6 hours (21600s)
    // We fetch ALL matches for the day.
    return fetchWithCache(`/fixtures?date=${date}`, 21600);
}

export async function getLeagueStandings(leagueId: number, season: number = 2024) {
    // Cache standings for 24 hours (86400s)
    return fetchWithCache(`/standings?league=${leagueId}&season=${season}`, 86400);
}

export async function getMatchDetails(fixtureId: string) {
    // For match details, we need multiple endpoints
    // 1. Basic fixture info
    // 2. Lineups
    // 3. Events
    // We'll fetch them all and combine

    const fixtureResponse = await fetchWithCache(`/fixtures?id=${fixtureId}`, 120);

    // Try to get lineups and events (these might not always be available)
    let lineups, events;
    try {
        const [lineupsRes, eventsRes] = await Promise.all([
            fetchWithCache(`/fixtures/lineups?fixture=${fixtureId}`, 300),
            fetchWithCache(`/fixtures/events?fixture=${fixtureId}`, 120)
        ]);
        lineups = lineupsRes.response;
        events = eventsRes.response;
    } catch (e) {
        console.log('Lineups/Events not available for this match');
    }

    return {
        ...fixtureResponse,
        lineups,
        events
    };
}

export async function getTeamFixtures(teamId: number, last: number = 5, next: number = 5) {
    // Get last N and next N fixtures for a team
    // Cache for 6 hours as fixture schedule doesn't change often
    return fetchWithCache(`/fixtures?team=${teamId}&last=${last}&next=${next}`, 21600);
}
