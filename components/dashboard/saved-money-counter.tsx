'use client';

import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface SavedMoneyCounterProps {
    amount: number;
}

export function SavedMoneyCounter({ amount }: SavedMoneyCounterProps) {
    return (
        <Card className="bg-foreground text-background border-none shadow-2xl relative overflow-hidden group">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-background rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-background rounded-full -ml-16 -mb-16 blur-3xl animate-pulse delay-700" />
            </div>

            <CardContent className="p-8 flex flex-col items-center justify-center relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">지금까지 막은 비용</span>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-4xl md:text-5xl font-black tracking-tighter">
                        {formatCurrency(amount, 'KRW')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold opacity-60">실제 비용 절감액</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
