import { NextResponse } from 'next/server';
import { DEFAULT_EXCHANGE_RATE, getExchangeRate } from '@/lib/exchangeRate';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    try {
        const { rate, source } = await getExchangeRate();
        return NextResponse.json({ rate, source });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch exchange rate', rate: DEFAULT_EXCHANGE_RATE, source: 'mock' }, { status: 500 });
    }
}
