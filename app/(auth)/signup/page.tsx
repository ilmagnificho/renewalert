import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
    return (
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">회원가입</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    갱신알림과 함께 스마트한 계약 관리를 시작하세요
                </p>
            </div>

            <div className="p-8 backdrop-blur-xl bg-card border border-border shadow-2xl rounded-xl text-center space-y-6">
                <p className="text-muted-foreground">
                    지금 가입하시면 <strong>Pro 플랜(월 49,000원)</strong> 기능을<br />
                    <strong>한 달간 무료</strong>로 체험하실 수 있습니다.
                </p>

                <Link href="/login" className="block w-full">
                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition-colors">
                        로그인 페이지로 이동하여 체험하기
                    </button>
                </Link>
                <p className="text-xs text-muted-foreground text-balanced">
                    * 회원가입 절차는 현재 로그인 페이지에서 통합 관리되고 있습니다.
                </p>
            </div>
        </div>
    );
}
