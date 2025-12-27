
export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface Team {
    id: string;
    name: string;
    badge?: string;
    score?: number;
}

export interface Match {
    id: string;
    title?: string;
    league?: string | {
        id?: number;
        name?: string;
        country?: string;
        logo?: string;
        flag?: string;
        year?: string;
        stage?: string;
        round?: string;
    };
    country?: string;
    countryCode?: string;
    status?: string;
    startTime?: string;
    start_time?: string;
    home_team: string;
    away_team: string;
    home_badge?: string;
    away_badge?: string;
    home_score?: number;
    away_score?: number;
    homeTeam?: {
        id: string;
        name: string;
        badge?: string;
        score?: number;
    };
    awayTeam?: {
        id: string;
        name: string;
        badge?: string;
        score?: number;
    };
    timer?: string;
    sources?: any[];
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
    goals_for: number;
    goals_against: number;
    points: number;
    form: string;
}

export interface Score {
    id: string;
    home: { name: string; score: string | number; badge?: string };
    away: { name: string; score: string | number; badge?: string };
    timer?: string;
    league?: string;
    status?: string;
}

export const fetcher = async (url: string) => {


    try {
        const res = await fetch(url);


        if (!res.ok) {
            const errorText = await res.text();


            if (res.status === 404) {

                return null;
            }

            throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const text = await res.text();


        if (!text) {

            return null;
        }

        try {
            const parsed = JSON.parse(text);

            return parsed;
        } catch (e) {

            return null;
        }
    } catch (error) {

        throw error;
    }
}
