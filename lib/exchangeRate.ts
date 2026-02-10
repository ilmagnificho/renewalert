export const DEFAULT_EXCHANGE_RATE = 1400;
export type ExchangeRateSource = 'api' | 'mock';

export interface ExchangeRateResult {
    rate: number;
    source: ExchangeRateSource;
}

export async function getExchangeRate(): Promise<ExchangeRateResult> {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD', {
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            return { rate: DEFAULT_EXCHANGE_RATE, source: 'mock' };
        }

        const data = await response.json();
        const rate = Number(data?.rates?.KRW);

        if (!Number.isFinite(rate) || rate <= 0) {
            return { rate: DEFAULT_EXCHANGE_RATE, source: 'mock' };
        }

        return { rate, source: 'api' };
    } catch (error) {
        console.error('Exchange rate fetch error:', error);
        return { rate: DEFAULT_EXCHANGE_RATE, source: 'mock' };
    }
}

export async function getUSDToKRWRate(): Promise<number> {
    const result = await getExchangeRate();
    return result.rate;
}
