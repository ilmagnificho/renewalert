import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { SuperAdminProvider } from "@/contexts/SuperAdminContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RenewAlert - 구독/계약 갱신 알림 서비스",
    template: "%s | RenewAlert",
  },
  description:
    "매월 나가는 구독료, 잊지 말고 관리하세요. SaaS, 임대료, 보험료 등 모든 계약의 갱신과 만기를 놓치지 않도록 알려드립니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ToastProvider>
            <OrganizationProvider>
              <SuperAdminProvider>{children}</SuperAdminProvider>
            </OrganizationProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
