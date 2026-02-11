'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Invitation, OrganizationMember } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface MemberWithUser extends OrganizationMember {
    user: {
        email: string;
        name: string | null;
    };
}

export default function TeamSettingsPage() {
    const { organization, isAdmin, isLoading: isOrgLoading } = useOrganization();
    const { addToast } = useToast();
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [members, setMembers] = useState<MemberWithUser[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!organization) return;
        fetchData();
    }, [organization]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [membersRes, invitationsRes] = await Promise.all([
                fetch('/api/organization/members'),
                isAdmin ? fetch('/api/invitations') : Promise.resolve(new Response(JSON.stringify([]))),
            ]);

            if (membersRes.ok) {
                setMembers(await membersRes.json());
            }

            if (isAdmin && invitationsRes.ok) {
                setInvitations(await invitationsRes.json());
            }
        } catch (e) {
            console.error(e);
            addToast('error', '데이터를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setIsInviting(true);
        try {
            const res = await fetch('/api/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail, role: 'member' }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || '초대에 실패했습니다.');
            }

            const newInvitation = await res.json();
            setInvitations((prev) => [newInvitation, ...prev]);
            setInviteEmail('');
            addToast('success', '초대장이 발송되었습니다.');

            // In a real app, you might show the link here if not emailing
            // For MVP:
            console.log('Invitation Token:', newInvitation.token);
            // addToast('info', `Test Link: /invite/${newInvitation.token}`);
        } catch (e: any) {
            addToast('error', e.message);
        } finally {
            setIsInviting(false);
        }
    };

    const handleRevoke = async (id: string) => {
        try {
            const res = await fetch(`/api/invitations/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('취소에 실패했습니다.');

            setInvitations((prev) => prev.filter((inv) => inv.id !== id));
            addToast('success', '초대가 취소되었습니다.');
        } catch (e: any) {
            addToast('error', e.message);
        }
    };

    if (isOrgLoading || isLoading) {
        return <div className="p-8 space-y-4 animate-pulse">
            <div className="h-48 bg-zinc-900/50 rounded-xl" />
            <div className="h-64 bg-zinc-900/50 rounded-xl" />
        </div>;
    }

    if (!organization) {
        return <div className="p-8 text-center">조직을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            <div>
                <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                    ← 설정으로 돌아가기
                </Link>
                <h1 className="text-2xl font-bold">팀 관리</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {organization.name} 팀원 및 초대를 관리합니다.
                </p>
            </div>

            {/* Invite Section */}
            {isAdmin && (
                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle className="text-lg">새로운 팀원 초대</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleInvite} className="flex gap-4">
                            <Input
                                placeholder="이메일 주소를 입력하세요"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="flex-1 bg-background"
                                required
                            />
                            <Button type="submit" isLoading={isInviting}>초대하기</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Pending Invitations */}
            {isAdmin && invitations.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">대기 중인 초대</h2>
                    <div className="grid gap-4">
                        {invitations.map((invitation) => (
                            <div key={invitation.id} className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg">
                                <div>
                                    <p className="font-medium text-foreground">{invitation.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                            {invitation.role === 'admin' ? '관리자' : '팀원'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(invitation.created_at).toLocaleDateString()} 보냄
                                        </span>
                                        <span className="text-xs text-muted-foreground select-all font-mono bg-muted px-1 py-0.5 rounded">
                                            /invite/{invitation.token}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRevoke(invitation.id)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    취소
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Member List */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">팀원 목록 ({members.length})</h2>
                <div className="grid gap-4">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {(member.user.name || member.user.email)?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-foreground">{member.user.name || '방문자'}</p>
                                        <Badge variant="secondary" className="text-xs">
                                            {member.role === 'owner' ? '소유자' : member.role === 'admin' ? '관리자' : '팀원'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                </div>
                            </div>
                            {/* Actions (if admin/owner, except self) */}
                            {/* For MVP, remove logic not implemented fully yet in API, just listing */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
