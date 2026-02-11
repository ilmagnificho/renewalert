'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';


interface AdminOrganization {
    id: string;
    name: string;
    plan: string;
    memberCount: number;
    contractCount: number;
    created_at: string;
}

export default function AdminDashboard() {
    const [organizations, setOrganizations] = useState<AdminOrganization[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const res = await fetch('/api/admin/organizations');
            if (res.ok) {
                const data = await res.json();
                setOrganizations(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="space-y-4 animate-pulse">
            <div className="h-8 w-48 bg-zinc-800 rounded" />
            <div className="h-64 bg-zinc-800 rounded-xl" />
        </div>;
    }

    const totalOrgs = organizations.length;
    const totalContracts = organizations.reduce((acc, org) => acc + org.contractCount, 0);

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold">Platform Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Organizations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrgs}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Contracts Managed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalContracts}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead>Contracts</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {organizations.map((org) => (
                                <TableRow key={org.id}>
                                    <TableCell className="font-medium">{org.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={org.plan === 'enterprise' ? 'default' : 'secondary'}>
                                            {org.plan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{org.memberCount}</TableCell>
                                    <TableCell>{org.contractCount}</TableCell>
                                    <TableCell>{new Date(org.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/org/${org.id}`}>
                                            <Button size="sm" variant="outline">View</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
