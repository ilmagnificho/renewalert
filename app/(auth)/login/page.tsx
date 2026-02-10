'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    const { addToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDemoLoading, setIsDemoLoading] = useState(false);

    // Auto-trigger demo login if query param is present
    useEffect(() => {
        if (searchParams.get('auto_demo') === 'true') {
            handleDemoLogin();
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            addToast('error', '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
            setIsLoading(false);
        } else {
            addToast('success', '로그인되었습니다.');
            router.push('/dashboard');
            router.refresh();
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/api/auth/callback`,
            },
        });

        if (error) {
            addToast('error', 'Google 로그인 중 오류가 발생했습니다.');
        }
    };

    const handleDemoLogin = async () => {
        setIsDemoLoading(true);
        // Shared demo account to avoid Rate Limits and Email Validation issues
        const demoEmail = 'public_demo@renewalert.com';
        const demoPassword = 'demo1234';

        try {
            // 1. Try Login first
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: demoEmail,
                password: demoPassword,
            });

            if (!signInError && signInData.session) {
                addToast('success', '체험하기 모드로 시작합니다.');
                router.push('/dashboard');
                router.refresh();
                return;
            }

            // 2. If Login failed, it might be because the user doesn't exist yet. Try Signing Up.
            console.warn('Demo login failed, attempting signup:', signInError?.message);

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: demoEmail,
                password: demoPassword,
                options: {
                    data: {
                        name: 'Demo User',
                    }
                }
            });

            if (signUpError) {
                if (signUpError.message.includes('already registered')) {
                    // User exists but login failed -> Password mismatch?
                    addToast('error', '데모 계정 설정 오류 (비밀번호 불일치). 관리자에게 문의하세요.');
                } else if (signUpError.message.includes('rate limit')) {
                    addToast('error', '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.');
                } else {
                    addToast('error', `데모 계정 오류: ${signUpError.message}`);
                }
                setIsDemoLoading(false);
                return;
            }

            if (signUpData.session) {
                addToast('success', '체험하기 계정이 생성되었습니다.');
                router.push('/dashboard');
                router.refresh();
            } else {
                // Signup successful but no session -> Email confirmation enabled
                addToast('info', '계정이 생성되었으나 이메일 인증이 필요할 수 있습니다. (Supabase 설정 확인 필요)');
                setIsDemoLoading(false);
            }

        } catch (err) {
            console.error('Unexpected Demo Error:', err);
            addToast('error', '알 수 없는 오류가 발생했습니다.');
            setIsDemoLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">로그인</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    계약 관리의 시작, 갱신알림
                </p>
            </div>

            <Card className="p-8 backdrop-blur-xl bg-card border-border shadow-2xl">
                <form onSubmit={handleLogin} className="space-y-6">
                    <Input
                        id="email"
                        type="email"
                        label="이메일"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background border-input"
                    />

                    <div className="space-y-1">
                        <Input
                            id="password"
                            type="password"
                            label="비밀번호"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-background border-input"
                        />
                        <div className="text-right">
                            <Link href="#" className="text-xs text-primary hover:text-primary/80">
                                비밀번호를 잊으셨나요?
                            </Link>
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" isLoading={isLoading}>
                        이메일로 로그인
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                또는
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="google"
                        onClick={handleGoogleLogin}
                        className="w-full"
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google로 계속하기
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                테스트를 원하시나요?
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleDemoLogin}
                        className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                        isLoading={isDemoLoading}
                    >
                        🚀 회원가입 없이 체험하기 (Demo)
                    </Button>
                </form>
            </Card>

            <p className="px-8 text-center text-sm text-muted-foreground">
                계정이 없으신가요?{' '}
                <Link
                    href="/signup"
                    className="hover:text-primary underline underline-offset-4 transition-colors"
                >
                    회원가입
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <LoginContent />
        </Suspense>
    )
}
