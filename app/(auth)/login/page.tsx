'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            setIsLoading(false);
            return;
        }

        router.push('/dashboard');
        router.refresh();
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });
    };

    return (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-center mb-6">로그인</h2>

            <form onSubmit={handleLogin} className="space-y-4">
                <Input
                    id="email"
                    label="이메일"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    id="password"
                    label="비밀번호"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && (
                    <p className="text-sm text-danger bg-danger-bg px-3 py-2 rounded-lg">{error}</p>
                )}

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    로그인
                </Button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dark-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-dark-card text-text-tertiary">또는</span>
                </div>
            </div>

            <Button
                variant="secondary"
                className="w-full"
                onClick={handleGoogleLogin}
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google로 계속하기
            </Button>

            <p className="text-center text-sm text-text-secondary mt-6">
                아직 계정이 없으신가요?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                    회원가입
                </Link>
            </p>
        </div>
    );
}
