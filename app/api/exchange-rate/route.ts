import { NextResponse } from 'next/server';
import { getUSDToKRWRate } from '@/lib/exchange-rate';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    try {
        const rate = await getUSDToKRWRate();
        return NextResponse.json({ rate });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch exchange rate', rate: 1400 }, { status: 500 });
    }
}
