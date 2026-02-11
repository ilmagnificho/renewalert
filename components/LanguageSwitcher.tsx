'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={locale === 'ko' ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchLocale('ko')}
                className="w-12 h-8 text-xs"
            >
                KO
            </Button>
            <Button
                variant={locale === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchLocale('en')}
                className="w-12 h-8 text-xs"
            >
                EN
            </Button>
        </div>
    );
}
