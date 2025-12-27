export interface Team {
    id: string
    name: string
    logo?: string
    badge?: string // Added for consistency with API
    score: number
    country?: string
}

export interface MatchEvent {
    time: string
    type: 'goal' | 'card' | 'sub' | 'status'
    team: 'home' | 'away'
    player: string
    assist?: string
    cardType?: 'yellow' | 'red'
}

export interface Match {
    id: string
    league: string | any
    country: string
    countryCode: string
    homeTeam: Team
    awayTeam: Team
    status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'HT'
    startTime: string
    time?: string
    video_url?: string
    title?: string
    events?: MatchEvent[]
    stadium?: string
    referee?: string
    sources?: { source: string; id: string }[]
    // Fallback fields for inconsistent API responses
    home_team?: string
    away_team?: string
    home_badge?: string
    away_badge?: string
    home_score?: number
    away_score?: number
}
