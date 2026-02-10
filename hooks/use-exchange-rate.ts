'use client';

import { useState, useEffect } from 'react';

interface ExchangeRateData {
    rate: number;
    lastUpdated: number;
}

const CACHE_KEY = 'renewalert_exchange_rate';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useExchangeRate() {
    const [rate, setRate] = useState<number>(1400); // Default fallback
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                // Check cache
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const data: ExchangeRateData = JSON.parse(cached);
                    const now = Date.now();
                    if (now - data.lastUpdated < CACHE_DURATION) {
                        setRate(data.rate);
                        setIsLoading(false);
                        return;
                    }
                }

                // Fetch fresh
                const res = await fetch('/api/exchange-rate');
                if (res.ok) {
                    const data = await res.json();
                    setRate(data.rate);

                    // Update cache
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        rate: data.rate,
                        lastUpdated: Date.now()
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch exchange rate:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRate();
    }, []);

    return { rate, isLoading };
}
