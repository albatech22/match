export const SPORT_API_BASE = 'https://api.sportsrc.org/';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

// Existing types...
export interface Match {
    id: string;
    title?: string;
    category?: string;
    date?: number; // Timestamp
    formatted_date?: string; // Optional for UI
    teams?: {
        home: { name: string; badge?: string };
        away: { name: string; badge?: string };
    };
    status?: string; // Derived or optional
    league?: string; // Often missing in this endpoint, can use title or category
    video_url?: string; // For match details
    country?: string;
    countryCode?: string;
    startTime?: string;
    start_time?: string;
    homeTeam?: { id?: string; name: string; score?: number; badge?: string };
    awayTeam?: { id?: string; name: string; score?: number; badge?: string };
    home_team?: string;
    away_team?: string;
    home_badge?: string;
    away_badge?: string;
    home_score?: number;
    away_score?: number;
    sources?: any[];
    events?: any[];
    timer?: string; // Match time e.g. "45'"
}

export interface StandingRow {
    position: number;
    team: {
        name: string;
        badge?: string;
    };
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goals_for: number; // GF
    goals_against: number; // GA
    points: number;
    form: string; // e.g. "WWDLW"
}

export interface League {
    id: string;
    name: string;
    logo?: string;
    season?: string;
}

export interface VideoSnippet {
    title: string;
    url: string; // Embed or source
    thumbnail: string;
    date: string;
    duration: string;
}

export interface Score {
    id: string; // Match ID or similar unique identifier
    home: { name: string; score: string | number; badge?: string };
    away: { name: string; score: string | number; badge?: string };
    timer?: string; // e.g. "45'"
    league?: string;
    status?: string;
}

export const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('API Error');
    }
    const text = await res.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch (e) {
        return null;
    }
}
