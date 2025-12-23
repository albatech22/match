import { Match } from '@/types/match'

export const LIVE_MATCHES: Match[] = [
    {
        id: '1',
        league: 'Premier League',
        country: 'England',
        countryCode: 'gb-eng',
        homeTeam: { id: 'mci', name: 'Man City', score: 2, logo: '/mci.png' },
        awayTeam: { id: 'liv', name: 'Liverpool', score: 1, logo: '/liv.png' },
        status: 'LIVE',
        startTime: '20:00',
        time: '74'
    },
    {
        id: '2',
        league: 'La Liga',
        country: 'Spain',
        countryCode: 'es',
        homeTeam: { id: 'rm', name: 'Real Madrid', score: 0, logo: '/rm.png' },
        awayTeam: { id: 'bar', name: 'Barcelona', score: 0, logo: '/bar.png' },
        status: 'LIVE',
        startTime: '21:00',
        time: '12'
    },
    {
        id: '3',
        league: 'NBA',
        country: 'USA',
        countryCode: 'us',
        homeTeam: { id: 'lal', name: 'Lakers', score: 102, logo: '/lal.png' },
        awayTeam: { id: 'gsw', name: 'Warriors', score: 98, logo: '/gsw.png' },
        status: 'LIVE',
        startTime: '02:00',
        time: 'Q4'
    }
]

export const UPCOMING_MATCHES: Match[] = [
    {
        id: '4',
        league: 'Champions League',
        country: 'Europe',
        countryCode: 'eu',
        homeTeam: { id: 'bay', name: 'Bayern', score: 0 },
        awayTeam: { id: 'psg', name: 'PSG', score: 0 },
        status: 'SCHEDULED',
        startTime: '20:45'
    },
    {
        id: '5',
        league: 'Serie A',
        country: 'Italy',
        countryCode: 'it',
        homeTeam: { id: 'mil', name: 'AC Milan', score: 0 },
        awayTeam: { id: 'int', name: 'Inter', score: 0 },
        status: 'SCHEDULED',
        startTime: '18:00'
    }
]

export async function getLiveMatches(): Promise<Match[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return LIVE_MATCHES
}

export async function getUpcomingMatches(): Promise<Match[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return UPCOMING_MATCHES
}

export async function getFeaturedMatch(): Promise<Match> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return LIVE_MATCHES[0]
}
