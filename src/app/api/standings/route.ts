import { NextRequest, NextResponse } from 'next/server';
import { getLeagueStandings } from '@/lib/api-football';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const leagueCode = searchParams.get('league');
    const leagueIdParam = searchParams.get('leagueId');
    const season = parseInt(searchParams.get('season') || '2024');

    let leagueId = leagueIdParam ? parseInt(leagueIdParam) : null;

    if (!leagueId && leagueCode) {
        leagueId = LEAGUE_ID_MAP[leagueCode];
    }

    if (!leagueId) {
        return NextResponse.json(
            { success: false, error: 'Invalid league code or ID' },
            { status: 400 }
        );
    }

    try {
        const data = await getLeagueStandings(leagueId, season);
        return NextResponse.json(
            { success: true, data: data.response },
            {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            }
        );

    } catch (error) {
        console.error('Standings API Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch standings' },
            { status: 500 }
        );
    }
}
