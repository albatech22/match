import { NextRequest, NextResponse } from 'next/server';
import { getMatchVideos } from '@/lib/api-football';

export const maxDuration = 60;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    console.log(`[API-ROUTE] Fetching videos for match ID: ${id}`);

    try {
        const data = await getMatchVideos(id);

        console.log(`[API-ROUTE] Videos fetched:`, {
            hasData: !!data,
            hasResponse: !!data?.response,
            videoCount: data?.response?.length || 0
        });

        return NextResponse.json({ success: true, data: data.response });
    } catch (error) {
        console.error(`[API-ROUTE] Error fetching videos for match ${id}:`, error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch match videos',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
