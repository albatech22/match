import { NextRequest, NextResponse } from 'next/server';
import { getMatchDetails, getTeamFixtures } from '@/lib/api-football';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // Maximum execution time in seconds


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log(`[API-ROUTE] ========== START: Fetching match details for ID: ${id} ==========`);

    try {
        console.log(`[API-ROUTE] Calling getMatchDetails(${id})`);
        const data = await getMatchDetails(id);

        console.log(`[API-ROUTE] getMatchDetails returned:`, {
            hasData: !!data,
            hasResponse: !!data?.response,
            responseLength: data?.response?.length || 0,
            responseType: Array.isArray(data?.response) ? 'array' : typeof data?.response
        });

        const match = data?.response?.[0];
        console.log(`[API-ROUTE] Match extracted:`, {
            hasMatch: !!match,
            hasTeams: !!match?.teams,
            homeTeam: match?.teams?.home?.name,
            awayTeam: match?.teams?.away?.name
        });

        if (match && match.teams && match.teams.home && match.teams.away) {
            const homeId = match.teams.home.id;
            const awayId = match.teams.away.id;

            console.log(`[API-ROUTE] Team IDs - Home: ${homeId}, Away: ${awayId}`);

            // Only fetch team fixtures if we have valid numeric IDs
            if (homeId && awayId) {
                try {
                    const homeIdNum = typeof homeId === 'string' ? parseInt(homeId) : homeId;
                    const awayIdNum = typeof awayId === 'string' ? parseInt(awayId) : awayId;

                    console.log(`[API-ROUTE] Parsed team IDs - Home: ${homeIdNum}, Away: ${awayIdNum}`);

                    if (!isNaN(homeIdNum) && !isNaN(awayIdNum)) {
                        console.log(`[API-ROUTE] Fetching team fixtures...`);
                        const [homeFixtures, awayFixtures] = await Promise.all([
                            getTeamFixtures(homeIdNum, 0, 5),
                            getTeamFixtures(awayIdNum, 0, 5)
                        ]);
                        console.log(`[API-ROUTE] Team fixtures fetched - Home: ${homeFixtures.response?.length || 0}, Away: ${awayFixtures.response?.length || 0}`);
                        (data as any).teamFixtures = {
                            home: homeFixtures.response,
                            away: awayFixtures.response
                        };
                    } else {
                        console.log(`[API-ROUTE] Invalid team IDs for match ${id} (NaN after parsing)`);
                    }
                } catch (error) {
                    console.error(`[API-ROUTE] Failed to fetch team fixtures for match ${id}:`, {
                        message: error instanceof Error ? error.message : 'Unknown error',
                        stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined
                    });
                }
            } else {
                console.log(`[API-ROUTE] Missing team IDs for match ${id}`);
            }
        } else {
            console.log(`[API-ROUTE] No valid match data to fetch team fixtures`);
        }

        console.log(`[API-ROUTE] ========== SUCCESS: Match details for ID: ${id} ==========`);
        return NextResponse.json(
            { success: true, data },
            {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            }
        );

    } catch (error) {
        console.error(`[API-ROUTE] ========== ERROR: Match Detail Error for ID ${id} ==========`);
        console.error('[API-ROUTE] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined,
            cause: error instanceof Error ? error.cause : undefined
        });
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch match details',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
