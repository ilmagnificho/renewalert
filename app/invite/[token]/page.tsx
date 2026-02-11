'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

export default function InvitationPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState(false);
    const [invitationData, setInvitationData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        checkUserAndInvitation();
    }, [params.token]);

    const checkUserAndInvitation = async () => {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // Fetch invitation details valid info
        // We can't use existing API because it requires being a member.
        // We need a public endpoint or server action to validate token and return org name/email.
        // But for MVP, let's just use accept route which validates.
        // Or create a new endpoint GET /api/invitations/[token] (public?)
        // Let's rely on server action logic or client-side try.
        // For UI, better to show "Invited to join [Org Name]".
        // I'll assume token is valid for UI rendering or show generic message.
        // Actually, user needs to know what they are joining.
        // I should have a public/verification endpoint.
        // I'll create one `GET /api/invitations/[token]`.
        // But `lib/invitations.ts` `getInvitationByToken` implementation uses `createClient` (admin context?)
        // If RLS is strict, public client can't read `invitations`.
        // I need `createClient` with service role or admin access to read invitation by token for validation.
        // Or `invitations` table should be readable by anyone with correct token? RLS doesn't support "token based read" easily unless token is in query.

        // For now, I'll fetch invitation via specific API that uses service role or strict token check.
        // I'll wrap `getInvitationByToken` in a server action or API route.
        // I already wrote `getInvitationByToken` in `lib`. I can use it in a Server Component page?
        // But this is Client Component.
        // I'll use a new API route `GET /api/invitations/[token]`.

        if (!user) {
            // If not logged in, we might want to redirect, but maybe show "Login to accept" first.
            // We can fetch invitation info if we have API.
        }

        try {
            const res = await fetch(`/api/invitations/validate/${params.token}`);
            if (res.ok) {
                const data = await res.json();
                setInvitationData(data);
            } else {
                const err = await res.json();
                setError(err.error || '유효하지 않거나 만료된 초대입니다.');
            }
        } catch (e) {
            setError('초대 정보를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!user) {
            router.push(`/login?next=/invite/${params.token}`);
            return;
        }

        setIsAccepting(true);
        try {
            const res = await fetch(`/api/invitations/${params.token}/accept`, {
                method: 'POST',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || '초대 수락에 실패했습니다.');
            }

            const data = await res.json();
            addToast('success', '팀에 성공적으로 합류했습니다!');
            // Force refresh or redirect to dashboard
            window.location.href = '/dashboard';
        } catch (e: any) {
            addToast('error', e.message);
            setIsAccepting(false);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>;
    }

    if (error) {
        return <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-center space-y-4">
                <div className="text-4xl">⚠️</div>
                <h1 className="text-xl font-bold">오류가 발생했습니다</h1>
                <p className="text-muted-foreground">{error}</p>
                <Link href="/">
                    <Button variant="outline">홈으로 돌아가기</Button>
                </Link>
            </div>
        </div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4 animate-in fade-in zoom-in-95 duration-300">
            <Card className="w-full max-w-md border-border shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">팀 초대</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-muted-foreground">
                            <span className="font-bold text-foreground">{invitationData?.organization?.name || '조직'}</span>에서 당신을 팀원으로 초대했습니다.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            초대된 이메일: <span className="text-foreground font-mono">{invitationData?.email}</span>
                        </p>
                    </div>

                    {!user ? (
                        <div className="space-y-3">
                            <Button className="w-full" onClick={() => router.push(`/login?next=/invite/${params.token}`)}>
                                로그인하고 수락하기
                            </Button>
                            <div className="text-center">
                                <Link href={`/signup?next=/invite/${params.token}`} className="text-sm text-muted-foreground hover:text-foreground underline">
                                    계정이 없으신가요? 회원가입
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="p-3 bg-muted/50 rounded-lg text-sm text-center">
                                현재 로그인된 계정: <span className="font-medium">{user.email}</span>
                            </div>
                            {user.email !== invitationData?.email && (
                                <div className="text-xs text-red-400 text-center mb-2">
                                    주의: 초대된 이메일과 현재 로그인된 이메일이 다릅니다.
                                </div>
                            )}
                            <Button className="w-full" onClick={handleAccept} isLoading={isAccepting}>
                                초대 수락하고 팀 합류하기
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
