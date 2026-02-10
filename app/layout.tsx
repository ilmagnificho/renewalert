import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "갱신알림 - 계약 만기 알림 서비스",
  description: "연간 결제 자동갱신, 임대 계약 갱신 놓치면 수백만원 손해. 갱신알림이 미리 알려드립니다.",
  keywords: "SaaS 구독 관리, 계약 만기 알림, 구독료 관리, 갱신 알림, 스타트업",
  openGraph: {
    title: "갱신알림 - 계약 만기 알림 서비스",
    description: "SaaS 구독과 계약 만기를 놓치지 않도록 미리 알려드립니다.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
