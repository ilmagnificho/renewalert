'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const supabase = createClient();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (password.length < 6) {
            setError('비밀번호는 6자 이상이어야 합니다.');
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) {
            setError(error.message === 'User already registered'
                ? '이미 가입된 이메일입니다.'
                : '회원가입에 실패했습니다. 다시 시도해주세요.');
            setIsLoading(false);
            return;
        }

        setIsSuccess(true);
        setIsLoading(false);
    };

    const handleGoogleSignup = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });
    };

    if (isSuccess) {
        return (
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">이메일을 확인해주세요</h2>
                <p className="text-text-secondary text-sm mb-4">
                    {email}로 인증 메일을 보냈습니다.
                    <br />
                    메일의 링크를 클릭하면 가입이 완료됩니다.
                </p>
                <Button variant="ghost" onClick={() => router.push('/login')}>
                    로그인으로 돌아가기
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-center mb-6">회원가입</h2>

            <form onSubmit={handleSignup} className="space-y-4">
                <Input
                    id="name"
                    label="이름"
                    type="text"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                    placeholder="6자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Input
                    id="confirmPassword"
                    label="비밀번호 확인"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && (
                    <p className="text-sm text-danger bg-danger-bg px-3 py-2 rounded-lg">{error}</p>
                )}

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    회원가입
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
                onClick={handleGoogleSignup}
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google로 시작하기
            </Button>

            <p className="text-center text-sm text-text-secondary mt-6">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="text-primary hover:underline">
                    로그인
                </Link>
            </p>
        </div>
    );
}
