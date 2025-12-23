import { NextRequest, NextResponse } from 'next/server';
import { getLeagueStandings } from '@/lib/api-football';

// Map league codes to API-Football league IDs
const LEAGUE_ID_MAP: Record<string, number> = {
    'PL': 39,      // Premier League
    'CL': 2,       // Champions League
    'LL': 140,     // La Liga
    'SA': 135,     // Serie A
    'BL': 78,      // Bundesliga
    'L1': 61,      // Ligue 1
    'PD': 140,     // La Liga (alternative code)
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const league = searchParams.get('league') || 'PL';
    const season = parseInt(searchParams.get('season') || '2024');

    const leagueId = LEAGUE_ID_MAP[league];

    if (!leagueId) {
        return NextResponse.json(
            { success: false, error: 'Invalid league code' },
            { status: 400 }
        );
    }

    try {
        const data = await getLeagueStandings(leagueId, season);
        return NextResponse.json({ success: true, data: data.response });
    } catch (error) {
        console.error('Standings API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch standings' },
            { status: 500 }
        );
    }
}
