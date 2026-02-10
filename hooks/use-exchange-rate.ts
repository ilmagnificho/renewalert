'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_EXCHANGE_RATE, type ExchangeRateSource } from '@/lib/exchangeRate';

interface ExchangeRateData {
    rate: number;
    source: ExchangeRateSource;
    lastUpdated: number;
}

const CACHE_KEY = 'renewalert_exchange_rate';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useExchangeRate() {
    const [rate, setRate] = useState<number>(DEFAULT_EXCHANGE_RATE);
    const [source, setSource] = useState<ExchangeRateSource>('mock');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const data: ExchangeRateData = JSON.parse(cached);
                    const now = Date.now();
                    if (now - data.lastUpdated < CACHE_DURATION) {
                        setRate(data.rate);
                        setSource(data.source || 'mock');
                        setIsLoading(false);
                        return;
                    }
                }

                const res = await fetch('/api/exchange-rate');
                if (res.ok) {
                    const data = await res.json();
                    const nextRate = Number(data.rate) || DEFAULT_EXCHANGE_RATE;
                    const nextSource: ExchangeRateSource = data.source === 'api' ? 'api' : 'mock';

                    setRate(nextRate);
                    setSource(nextSource);

                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        rate: nextRate,
                        source: nextSource,
                        lastUpdated: Date.now(),
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch exchange rate:', error);
                setRate(DEFAULT_EXCHANGE_RATE);
                setSource('mock');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRate();
    }, []);

    return { rate, source, isLoading };
}
