export async function getUSDToKRWRate(): Promise<number> {
    const CACHE_KEY = 'usd_to_krw_rate';
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

    // In a real production environment, you might use a database or a more persistent cache.
    // For this implementation, we'll use a fetch-with-cache pattern or a simple mock if the API is down.

    try {
        // KEB 하나은행 API is not publicly accessible without specific keys.
        // Using open.er-api.com as a reliable public source.
        const response = await fetch('https://open.er-api.com/v6/latest/USD', {
            next: { revalidate: 3600 } // Cache for 1 hour in Next.js
        });

        if (!response.ok) throw new Error('Failed to fetch exchange rate');

        const data = await response.json();
        const rate = data.rates.KRW;

        return rate || 1400; // Fallback to 1400 if rate not found
    } catch (error) {
        console.error('Exchange rate fetch error:', error);
        return 1400; // Static fallback
    }
}
