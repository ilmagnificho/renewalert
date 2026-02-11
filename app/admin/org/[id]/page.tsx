'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';


interface AdminOrgMember {
    id: string;
    role: string;
    user: {
        name: string | null;
        email: string | null;
    } | null;
}

interface AdminOrgContract {
    id: string;
    name: string;
    status: string;
    amount: number;
    currency: string;
}

interface AdminOrganizationDetail {
    id: string;
    name: string;
    plan: string;
    members: AdminOrgMember[];
    contracts: AdminOrgContract[];
}

export default function AdminOrgDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [organization, setOrganization] = useState<AdminOrganizationDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrg();
    }, [params.id]);

    const fetchOrg = async () => {
        try {
            const res = await fetch(`/api/admin/organizations/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setOrganization(data);
            } else {
                router.push('/admin');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="space-y-4 animate-pulse">
            <div className="h-48 bg-zinc-800 rounded-xl" />
        </div>;
    }

    if (!organization) return null;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div>
                <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                    ← Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{organization.name}</h1>
                        <p className="text-muted-foreground mt-1">ID: {organization.id}</p>
                    </div>
                    <Badge>{organization.plan}</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Members ({organization.members.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {organization.members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="font-medium">{member.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-muted-foreground">{member.user?.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{member.role}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contracts ({organization.contracts.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {organization.contracts.map((contract) => (
                                    <TableRow key={contract.id}>
                                        <TableCell className="font-medium">{contract.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={contract.status === 'active' ? 'success' : 'secondary'}>
                                                {contract.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {contract.amount.toLocaleString()} {contract.currency}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* Add Contract Button logic: Super admin adding contract for org?
                            Maybe redirect to /admin/org/[id]/contracts/new?
                            Or just impersonation? For now simple list.
                        */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
