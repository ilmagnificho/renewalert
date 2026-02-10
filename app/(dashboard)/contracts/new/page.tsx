'use client';

import { ContractForm } from '@/components/contracts/contract-form';

export default function NewContractPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">새 계약 등록</h1>
                <p className="text-sm text-text-secondary mt-1">
                    SaaS 구독, 임대 계약, 보험 등을 등록하세요.
                </p>
            </div>
            <ContractForm mode="create" />
        </div>
    );
}
