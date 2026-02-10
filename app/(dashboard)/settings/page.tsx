'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';

export default function SettingsPage() {
    const supabase = createClient();
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setEmail(user.email || '');
                setName(user.user_metadata?.full_name || '');
            }
        });
    }, [supabase.auth]);

    const handleSave = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: name },
        });
        if (error) {
            addToast('error', '저장에 실패했습니다.');
        } else {
            addToast('success', '프로필이 업데이트되었습니다.');
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">설정</h1>
                <p className="text-sm text-text-secondary mt-1">계정 정보를 관리하세요.</p>
            </div>

            <Card>
                <h2 className="text-lg font-semibold mb-4">프로필</h2>
                <div className="space-y-4">
                    <Input
                        id="name"
                        label="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="이름을 입력하세요"
                    />
                    <Input
                        id="email"
                        label="이메일"
                        value={email}
                        disabled
                        helperText="이메일은 변경할 수 없습니다."
                    />
                    <Button onClick={handleSave} isLoading={isLoading}>
                        저장
                    </Button>
                </div>
            </Card>

            <Card>
                <h2 className="text-lg font-semibold mb-4">알림 설정</h2>
                <div className="space-y-3">
                    {['90일 전', '30일 전', '7일 전', '1일 전'].map((period) => (
                        <div key={period} className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium">만기 {period} 알림</p>
                                <p className="text-xs text-text-tertiary">이메일로 알림을 받습니다</p>
                            </div>
                            <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full translate-x-5" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
