import { NextRequest, NextResponse } from 'next/server';
import { getMatchDetails } from '@/lib/api-football';

export const maxDuration = 60; // Maximum execution time in seconds

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log(`[API] Fetching match details for ID: ${id}`);

    try {
        const data = await getMatchDetails(id);
        console.log(`[API] Successfully fetched match details for ID: ${id}`);
        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error(`[API] Match Detail Error for ID ${id}:`, error);
        console.error('[API] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
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
