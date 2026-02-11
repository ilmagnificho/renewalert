import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { SuperAdminProvider } from '@/contexts/SuperAdminContext';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: 'RenewAlert - 구독/계약 갱신 알림 서비스',
        template: '%s | RenewAlert',
    },
    description: '매월 나가는 구독료, 잊지 말고 관리하세요. SaaS, 임대료, 보험료 등 모든 계약의 갱신과 만기를 놓치지 않도록 알려드립니다.',
    keywords: ['구독 관리', '갱신 알림', 'SaaS 관리', '계약 관리', '스타트업 툴', '고정비 관리'],
    authors: [{ name: 'RenewAlert Team' }],
    creator: 'RenewAlert',
    openGraph: {
        type: 'website',
        locale: 'ko_KR', // This should be dynamic?
        url: 'https://renewalert.vercel.app',
        title: 'RenewAlert - 스마트한 구독/계약 관리',
        description: 'SaaS 구독부터 임대료까지, 모든 계약의 갱신 일정을 한눈에 관리하세요.',
        siteName: 'RenewAlert',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RenewAlert - 구독/계약 갱신 알림 서비스',
        description: 'SaaS, 임대료, 보험료 등 놓치기 쉬운 갱신 일정을 관리해드립니다.',
    },
    icons: {
        icon: '/favicon.svg',
        apple: '/favicon.svg',
    },
};

export const viewport = {
    width: 'device-width',
    'initial-scale': 1,
    'maximum-scale': 1,
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${inter.className} antialiased bg-background text-foreground transition-colors duration-300`}
            >
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        forcedTheme="dark"
                        enableSystem={false}
                        disableTransitionOnChange
                    >
                        <ToastProvider>
                            <OrganizationProvider>
                                <SuperAdminProvider>
                                    {children}
                                </SuperAdminProvider>
                            </OrganizationProvider>
                        </ToastProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
