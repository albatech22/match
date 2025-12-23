
import { NextRequest, NextResponse } from 'next/server';
import { getFixtures, getLiveMatches } from '@/lib/api-football';

export const maxDuration = 60; // Maximum execution time in seconds

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'live' or 'scheduled'
    const date = searchParams.get('date'); // YYYY-MM-DD for scheduled

    console.log(`[API] Fetching matches - type: ${type}, date: ${date}`);

    try {
        let data;

        if (type === 'live') {
            const response = await getLiveMatches();
            data = response.response; // API-Football returns { response: [...] }
        } else if (type === 'scheduled' && date) {
            const response = await getFixtures(date);
            data = response.response;
        } else {
            // Default to today's fixtures if nothing specified
            const today = new Date().toISOString().split('T')[0];
            const response = await getFixtures(today);
            data = response.response;
        }

        console.log(`[API] Successfully fetched ${data?.length || 0} matches`);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('[API] Route Error:', error);
        console.error('[API] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch matches',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
