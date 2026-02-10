# PRD: 갱신알림 (RenewAlert)

> **Version:** 1.0  
> **Last Updated:** 2025-02  
> **Author:** YJ (Tetra Corp CEO)  
> **Status:** Ready for Development

---

## 📌 Executive Summary

### 한 줄 정의
소규모 팀/스타트업 대표가 SaaS 구독과 계약 만기를 놓치지 않도록 미리 알려주는 서비스

### 핵심 가치 제안
"연간 결제 자동갱신, 임대 계약 갱신 놓치면 수백만원 손해. 우리가 미리 알려드립니다."

### 목표 지표 (6개월)
| 지표 | 목표 |
|------|------|
| 유료 고객 | 100개사 |
| MRR | ₩4,900,000 |
| Churn Rate | < 5%/월 |
| 평균 등록 계약 수 | 15개/회사 |

---

## 1. Problem Statement

### 1.1 현재 상황
- 5~50명 규모 스타트업은 평균 10~30개 SaaS 구독 중
- 계약 관리 전담자 없음 (대표 또는 경영지원 1명이 겸임)
- 관리 도구: Google Calendar, Notion, Excel → 체계적 관리 불가

### 1.2 Pain Point
| 상황 | 결과 | 손실 규모 |
|------|------|----------|
| SaaS 연간결제 자동갱신 놓침 | 불필요한 1년치 결제 | ₩100만~2,000만 |
| 임대 계약 갱신 기한 놓침 | 불리한 조건 수용 또는 퇴거 | ₩수백만~수천만 |
| 보험/서버 해지 통보 놓침 | 원치 않는 갱신 | ₩수십만~수백만 |

### 1.3 기존 대안의 한계
| 대안 | 문제점 |
|------|--------|
| Google Calendar | 맥락 없음, 금액 정보 없음, 팀 공유 어려움 |
| Notion | 직접 관리해야 함, 알림 기능 약함 |
| Excel | 아무도 안 봄, 알림 없음 |

---

## 2. Solution Overview

### 2.1 제품 컨셉
**"계약 만기 전용 알림 서비스"**

- 수동 입력 기반 (AI/OCR 없음)
- 만기 90/30/7/1일 전 자동 알림
- 대시보드에서 한눈에 현황 파악
- 갱신/해지 처리 기록

### 2.2 MVP 범위 (Phase 1)

**포함:**
- 회원가입/로그인
- 계약 CRUD (생성, 조회, 수정, 삭제)
- 대시보드 (만기 임박순 정렬)
- 이메일 알림 (90/30/7/1일 전)
- 결제 (Free → Pro 전환)
- 랜딩페이지

**제외 (Phase 2 이후):**
- Slack 연동
- 팀 멤버 초대
- 비용 리포트
- PDF 업로드
- AI 날짜 추출

### 2.3 기술 스택

| Layer | Technology | Reason |
|-------|------------|--------|
| Frontend | Next.js 14 (App Router) | SSR, 빠른 개발 |
| Styling | Tailwind CSS | 빠른 UI 구현 |
| Backend | Next.js API Routes | 별도 서버 불필요 |
| Database | Supabase (PostgreSQL) | Auth 내장, 무료 티어 |
| Auth | Supabase Auth | Google OAuth 지원 |
| Email | Resend | 개발자 친화적, 저렴 |
| Cron | Vercel Cron | 무료, 설정 간단 |
| Payment | 토스페이먼츠 or Stripe | 한국 결제 지원 |
| Hosting | Vercel | 무료 티어, 자동 배포 |

---

## 3. User Personas

### 3.1 Primary: 스타트업 대표 (김대표)
| 항목 | 내용 |
|------|------|
| 회사 규모 | 15명 |
| 사용 SaaS | Slack, Notion, Figma, AWS, Google Workspace 등 20개 |
| 계약 | 사무실 임대, 세무사, 법무법인, 보험 등 10개 |
| Pain | 작년에 Figma 연간결제 ₩800만 자동갱신됨 |
| Goal | 다시는 이런 일 없게 하고 싶음 |
| 기술 수준 | 중 (SaaS 익숙) |

### 3.2 Secondary: 경영지원 담당자 (이매니저)
| 항목 | 내용 |
|------|------|
| 역할 | 경영지원 + HR + 총무 겸임 |
| Pain | 대표가 계약 관리하라는데 어디서부터 해야 할지 모름 |
| Goal | 체계적으로 관리하고 싶음 |
| 기술 수준 | 중하 |

---

## 4. User Stories & Requirements

### 4.1 Epic 1: Authentication
| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| AUTH-1 | 사용자는 이메일로 회원가입할 수 있다 | P0 | 이메일 인증 후 가입 완료 |
| AUTH-2 | 사용자는 Google 계정으로 가입/로그인할 수 있다 | P0 | OAuth 플로우 정상 작동 |
| AUTH-3 | 사용자는 비밀번호를 재설정할 수 있다 | P1 | 이메일로 재설정 링크 수신 |
| AUTH-4 | 사용자는 로그아웃할 수 있다 | P0 | 세션 종료, 로그인 페이지로 이동 |

### 4.2 Epic 2: Contract Management
| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| CONT-1 | 사용자는 새 계약/구독을 등록할 수 있다 | P0 | 필수 필드 입력 후 저장 |
| CONT-2 | 사용자는 등록된 계약 목록을 볼 수 있다 | P0 | 만기 임박순 정렬 |
| CONT-3 | 사용자는 계약 정보를 수정할 수 있다 | P0 | 모든 필드 수정 가능 |
| CONT-4 | 사용자는 계약을 삭제할 수 있다 | P0 | 확인 후 삭제 |
| CONT-5 | 사용자는 계약을 "갱신 완료" 처리할 수 있다 | P0 | 상태 변경 + 다음 만기일 설정 |
| CONT-6 | 사용자는 계약을 "해지 완료" 처리할 수 있다 | P0 | 상태 변경 + 목록에서 비활성화 |
| CONT-7 | 사용자는 계약을 유형별로 필터링할 수 있다 | P1 | SaaS/임대/보험/기타 필터 |
| CONT-8 | 사용자는 계약을 검색할 수 있다 | P1 | 이름으로 검색 |

### 4.3 Epic 3: Dashboard
| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| DASH-1 | 사용자는 만기 임박 계약을 한눈에 볼 수 있다 | P0 | 긴급/주의/정상 상태 구분 |
| DASH-2 | 사용자는 이번 달 만기 계약 수를 볼 수 있다 | P0 | 숫자 카드 표시 |
| DASH-3 | 사용자는 총 구독료 합계를 볼 수 있다 | P1 | 월/연 기준 합계 |

### 4.4 Epic 4: Notifications
| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| NOTI-1 | 사용자는 만기 90일 전 이메일을 받는다 | P0 | 자동 발송 |
| NOTI-2 | 사용자는 만기 30일 전 이메일을 받는다 | P0 | 자동 발송 |
| NOTI-3 | 사용자는 만기 7일 전 이메일을 받는다 | P0 | 자동 발송 |
| NOTI-4 | 사용자는 만기 1일 전 이메일을 받는다 | P0 | 자동 발송 |
| NOTI-5 | 사용자는 알림 설정을 커스터마이징할 수 있다 | P2 | 알림 일자 변경 |

### 4.5 Epic 5: Payment
| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| PAY-1 | 사용자는 Free 플랜으로 시작할 수 있다 | P0 | 계약 3개 제한 |
| PAY-2 | 사용자는 Pro 플랜으로 업그레이드할 수 있다 | P0 | 결제 후 제한 해제 |
| PAY-3 | 사용자는 구독을 취소할 수 있다 | P0 | 다음 결제일부터 Free 전환 |
| PAY-4 | 사용자는 결제 내역을 볼 수 있다 | P1 | 결제 이력 표시 |

### 4.6 Epic 6: Landing Page
| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| LAND-1 | 방문자는 서비스 가치를 이해할 수 있다 | P0 | 3초 내 핵심 메시지 전달 |
| LAND-2 | 방문자는 가격을 확인할 수 있다 | P0 | 플랜별 가격표 |
| LAND-3 | 방문자는 무료로 시작할 수 있다 | P0 | CTA → 회원가입 |

---

## 5. Data Model

### 5.1 ERD (Entity Relationship Diagram)

```
┌─────────────────┐       ┌─────────────────────────┐
│     users       │       │       contracts         │
├─────────────────┤       ├─────────────────────────┤
│ id (PK)         │──────<│ id (PK)                 │
│ email           │       │ user_id (FK)            │
│ name            │       │ name                    │
│ plan            │       │ type                    │
│ created_at      │       │ amount                  │
│ updated_at      │       │ currency                │
└─────────────────┘       │ cycle                   │
                          │ expires_at              │
                          │ auto_renew              │
                          │ notice_days             │
                          │ status                  │
                          │ memo                    │
                          │ created_at              │
                          │ updated_at              │
                          └─────────────────────────┘
                                     │
                                     │
                          ┌─────────────────────────┐
                          │   notification_logs     │
                          ├─────────────────────────┤
                          │ id (PK)                 │
                          │ contract_id (FK)        │
                          │ type (90d/30d/7d/1d)    │
                          │ sent_at                 │
                          │ status                  │
                          └─────────────────────────┘
```

### 5.2 Table Definitions

#### users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 고유 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| name | VARCHAR(100) | | 이름 |
| plan | ENUM('free', 'pro') | DEFAULT 'free' | 플랜 |
| plan_expires_at | TIMESTAMP | | Pro 만료일 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

#### contracts
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 고유 ID |
| user_id | UUID | FK → users.id, NOT NULL | 사용자 |
| name | VARCHAR(200) | NOT NULL | 서비스/계약명 |
| type | ENUM | NOT NULL | saas/rent/insurance/other |
| amount | DECIMAL(12,2) | NOT NULL | 금액 |
| currency | VARCHAR(3) | DEFAULT 'KRW' | 통화 |
| cycle | ENUM | NOT NULL | monthly/yearly/onetime |
| expires_at | DATE | NOT NULL | 만기일 |
| auto_renew | BOOLEAN | DEFAULT false | 자동갱신 여부 |
| notice_days | INTEGER | DEFAULT 30 | 해지 통보 기한 |
| status | ENUM | DEFAULT 'active' | active/renewed/terminated |
| memo | TEXT | | 메모 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

#### notification_logs
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | 고유 ID |
| contract_id | UUID | FK → contracts.id | 계약 |
| type | ENUM | NOT NULL | 90d/30d/7d/1d |
| sent_at | TIMESTAMP | DEFAULT NOW() | 발송 시각 |
| status | ENUM | DEFAULT 'sent' | sent/failed |

---

## 6. API Specification

### 6.1 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | 이메일 회원가입 |
| POST | /api/auth/login | 로그인 |
| POST | /api/auth/logout | 로그아웃 |
| POST | /api/auth/reset-password | 비밀번호 재설정 요청 |
| GET | /api/auth/me | 현재 사용자 정보 |

### 6.2 Contracts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/contracts | 계약 목록 조회 |
| POST | /api/contracts | 계약 생성 |
| GET | /api/contracts/:id | 계약 상세 조회 |
| PUT | /api/contracts/:id | 계약 수정 |
| DELETE | /api/contracts/:id | 계약 삭제 |
| POST | /api/contracts/:id/renew | 갱신 완료 처리 |
| POST | /api/contracts/:id/terminate | 해지 완료 처리 |

### 6.3 Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard/summary | 대시보드 요약 데이터 |
| GET | /api/dashboard/upcoming | 만기 임박 계약 |

### 6.4 Notifications (Internal)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/cron/send-notifications | Cron에서 호출, 알림 발송 |

### 6.5 Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payment/create-checkout | 결제 세션 생성 |
| POST | /api/payment/webhook | 결제 완료 웹훅 |
| POST | /api/payment/cancel | 구독 취소 |

---

## 7. UI/UX Design

### 7.1 Design Principles

| 원칙 | 설명 |
|------|------|
| 명확성 | 만기 상태가 한눈에 보여야 함 |
| 단순성 | 클릭 3번 안에 핵심 작업 완료 |
| 긴급성 | 위험한 계약이 눈에 띄어야 함 |
| 신뢰감 | 비즈니스 툴다운 깔끔한 디자인 |

### 7.2 Color System

| 용도 | Color | Hex |
|------|-------|-----|
| Primary | Blue | #3B82F6 |
| Success | Green | #10B981 |
| Warning | Yellow | #F59E0B |
| Danger | Red | #EF4444 |
| Background | Dark | #0A0A0B |
| Card | Dark Gray | #141417 |
| Border | Gray | #2A2A30 |
| Text Primary | White | #FFFFFF |
| Text Secondary | Gray | #8B8B95 |

### 7.3 Typography

| 용도 | Font | Size | Weight |
|------|------|------|--------|
| Heading 1 | Pretendard | 32px | 700 |
| Heading 2 | Pretendard | 24px | 600 |
| Heading 3 | Pretendard | 18px | 600 |
| Body | Pretendard | 14px | 400 |
| Caption | Pretendard | 12px | 400 |
| Mono (금액) | JetBrains Mono | 14px | 500 |

### 7.4 Page Structure

```
/                     → 랜딩페이지 (public)
/login                → 로그인 (public)
/signup               → 회원가입 (public)
/dashboard            → 대시보드 (protected)
/contracts            → 계약 목록 (protected)
/contracts/new        → 계약 등록 (protected)
/contracts/:id        → 계약 상세/수정 (protected)
/settings             → 설정 (protected)
/settings/billing     → 결제 관리 (protected)
```

### 7.5 Wireframes

#### Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] 갱신알림          [Profile] [Settings] [Logout] │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Dashboard│  ┌────────┐ ┌────────┐ ┌────────┐           │
│ Contracts│  │ 긴급 3 │ │ 주의 5 │ │ 정상 12│           │
│ Settings │  └────────┘ └────────┘ └────────┘           │
│          │                                              │
│          │  ┌─────────────────────────────────────────┐ │
│          │  │ 만기 임박 계약                    [+추가]│ │
│          │  ├─────────────────────────────────────────┤ │
│          │  │ 🔴 Figma Pro      ₩9,600,000  D-3      │ │
│          │  │ 🟡 AWS Reserved   $12,000     D-28     │ │
│          │  │ 🟡 사무실 임대     ₩36,000,000 D-45     │ │
│          │  │ 🟢 Slack Business ₩1,200,000  D-120    │ │
│          │  └─────────────────────────────────────────┘ │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

#### Contract Form
```
┌─────────────────────────────────────────────────────────┐
│  ← 계약 등록                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  서비스/계약명 *                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Figma                                             │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  유형 *                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ ● SaaS  │ │ ○ 임대   │ │ ○ 보험   │ │ ○ 기타   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│  금액 *                      결제 주기 *                 │
│  ┌─────────────────────┐    ┌─────────────────────┐    │
│  │ ₩ 9,600,000        │    │ 연간 ▼              │    │
│  └─────────────────────┘    └─────────────────────┘    │
│                                                         │
│  만기일 *                    자동갱신                    │
│  ┌─────────────────────┐    ┌─────────────────────┐    │
│  │ 2025-12-31         │    │ ● 예  ○ 아니오      │    │
│  └─────────────────────┘    └─────────────────────┘    │
│                                                         │
│  해지 통보 기한                                          │
│  ┌─────────────────────┐                               │
│  │ 30일 전             │                               │
│  └─────────────────────┘                               │
│                                                         │
│  메모                                                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                    저장하기                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.6 Component Library

| Component | Description | States |
|-----------|-------------|--------|
| Button | Primary, Secondary, Ghost, Danger | Default, Hover, Active, Disabled |
| Input | Text, Number, Date, Select | Default, Focus, Error, Disabled |
| Card | Contract card, Summary card | Default, Hover |
| Badge | Status indicator | Danger (D-7), Warning (D-30), Success |
| Modal | Confirm, Alert | Open, Closed |
| Toast | Success, Error, Info | Show, Hide |
| Sidebar | Navigation | Collapsed, Expanded |
| Table | Contract list | Loading, Empty, Data |

### 7.7 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, Bottom nav |
| Tablet | 768px - 1024px | Collapsed sidebar |
| Desktop | > 1024px | Full sidebar |

---

## 8. Email Templates

### 8.1 알림 이메일 (D-90)

**Subject:** [갱신알림] {서비스명} 계약이 3개월 후 만료됩니다

```
안녕하세요, {사용자명}님

{서비스명} 계약이 90일 후 만료될 예정입니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 계약 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━
서비스명: {서비스명}
만기일: {만기일}
금액: {금액}
자동갱신: {예/아니오}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

{자동갱신인 경우}
⚠️ 자동갱신이 설정되어 있습니다. 
해지를 원하시면 {해지통보기한}일 전까지 처리해주세요.

[대시보드에서 확인하기]

감사합니다.
갱신알림 드림
```

### 8.2 알림 이메일 (D-7, 긴급)

**Subject:** 🚨 [긴급] {서비스명} 계약이 7일 후 만료됩니다!

```
안녕하세요, {사용자명}님

⚠️ 긴급: {서비스명} 계약이 7일 후 만료됩니다!

지금 확인하지 않으면 {금액}의 손실이 발생할 수 있습니다.

[지금 확인하기]

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 계약 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━
서비스명: {서비스명}
만기일: {만기일}
금액: {금액}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

감사합니다.
갱신알림 드림
```

---

## 9. Marketing Strategy

### 9.1 Positioning Statement

**For** 계약 관리 전담자가 없는 스타트업 대표  
**Who** SaaS 자동결제, 임대 계약 갱신을 놓쳐 손해본 경험이 있는  
**Our product** 갱신알림은 계약 만기 알림 서비스입니다  
**That** 만기 90일 전부터 자동으로 알려줍니다  
**Unlike** Google Calendar나 Notion 같은 범용 도구  
**We** 계약 관리에 특화되어 "돈을 지켜주는" 서비스입니다

### 9.2 Key Messages

| 메시지 | 용도 |
|--------|------|
| "연간 결제 자동갱신, 또 놓치실 건가요?" | 광고 헤드라인 |
| "캘린더는 알림만 줍니다. 우리는 돈을 지켜줍니다." | 차별화 |
| "만기 놓치면 수백만원. 월 49,000원으로 막으세요." | 가격 정당화 |
| "첫 달 무료. 계약 3개까지 평생 무료." | 진입 장벽 낮춤 |

### 9.3 GTM Phases

#### Phase 1: Cold Outreach (Week 1-8, 목표: 50개사)

**채널:**
- LinkedIn DM
- 콜드메일
- 스타트업 커뮤니티 (디스콤, 스타트업 슬랙)

**콜드메일 템플릿:**
```
제목: 작년에 SaaS 자동결제 놓치신 적 있으신가요?

{대표님 이름}님, 안녕하세요.

저는 갱신알림을 만들고 있는 {YJ}입니다.

혹시 작년에 Figma, Notion, AWS 같은 SaaS 연간 결제가 
자동으로 갱신되어서 당황하신 적 있으신가요?

저희가 만기 90일 전부터 알려드립니다.
첫 달 무료로 시작하실 수 있습니다.

5분만 시간 되시면 간단히 소개드려도 될까요?

감사합니다.
{YJ} 드림
```

**타겟 리스트 수집:**
- 스타트업 투자 뉴스 (더브이씨, 플래텀)
- LinkedIn 검색: "스타트업 대표", "CEO", "COO"
- 스타트업 데이터베이스 (로켓펀치, 원티드)

#### Phase 2: Referral (Week 9-16, 목표: 100개사 추가)

**방법:**
- 기존 고객에게 추천 시 1개월 무료
- "절약한 금액" 공유 기능 → SNS 바이럴

#### Phase 3: Content SEO (Week 17+, 목표: 300개사 추가)

**블로그 콘텐츠:**
- "스타트업이 자주 놓치는 계약 10가지"
- "SaaS 구독 비용 관리하는 법"
- "연간 결제 vs 월간 결제, 뭐가 유리할까"

**SEO 키워드:**
- "SaaS 구독 관리"
- "계약 만기 알림"
- "구독료 관리"

### 9.4 Pricing Strategy

| 플랜 | 가격 | 포함 | 타겟 |
|------|------|------|------|
| Free | ₩0 | 계약 3개, 이메일 알림 | 체험, 소규모 |
| Pro | ₩49,000/월 | 무제한, Slack (Phase 2) | 주력 |
| Concierge | ₩99,000/월 | Pro + 초기 입력 대행 + 전담 지원 | 고가치 |

**가격 결정 근거:**
- 연간 SaaS 자동갱신 1건 = ₩100만~2,000만
- 월 ₩49,000으로 1건만 막아도 ROI 20배 이상
- 너무 싸면 "중요하지 않은 서비스"로 인식

---

## 10. Development Plan

### 10.1 Sprint Plan (2주 단위)

#### Sprint 1: Foundation (Day 1-7)
| Task | Estimated | Owner |
|------|-----------|-------|
| Project setup (Next.js, Tailwind, Supabase) | 2h | Dev |
| Database schema & migration | 2h | Dev |
| Auth (signup, login, logout, Google OAuth) | 4h | Dev |
| Protected route middleware | 1h | Dev |
| Basic layout (Sidebar, Header) | 3h | Dev |

#### Sprint 2: Core Features (Day 8-14)
| Task | Estimated | Owner |
|------|-----------|-------|
| Contract CRUD API | 4h | Dev |
| Contract list page | 3h | Dev |
| Contract form (create/edit) | 4h | Dev |
| Dashboard summary API | 2h | Dev |
| Dashboard UI | 3h | Dev |

#### Sprint 3: Notifications & Payment (Day 15-21)
| Task | Estimated | Owner |
|------|-----------|-------|
| Cron job setup (Vercel Cron) | 1h | Dev |
| Notification logic | 3h | Dev |
| Email templates (Resend) | 2h | Dev |
| Notification log & dedup | 2h | Dev |
| Payment integration (토스페이먼츠) | 4h | Dev |
| Billing page | 2h | Dev |

#### Sprint 4: Landing & Polish (Day 22-28)
| Task | Estimated | Owner |
|------|-----------|-------|
| Landing page | 4h | Dev |
| Responsive design fixes | 2h | Dev |
| Error handling & edge cases | 2h | Dev |
| Testing & QA | 4h | Dev |
| Deployment & domain setup | 2h | Dev |

### 10.2 Milestones

| Milestone | Target Date | Deliverable |
|-----------|-------------|-------------|
| M1: Auth & DB | Day 7 | 로그인/가입 작동 |
| M2: Core CRUD | Day 14 | 계약 등록/조회 작동 |
| M3: Notifications | Day 21 | 이메일 알림 작동 |
| M4: MVP Launch | Day 28 | 전체 기능 + 랜딩 |

---

## 11. QA Plan

### 11.1 Test Categories

| Category | Description | Priority |
|----------|-------------|----------|
| Functional | 기능이 정상 작동하는가 | P0 |
| Edge Cases | 예외 상황 처리 | P1 |
| Security | 인증, 권한, 데이터 보호 | P0 |
| Performance | 로딩 속도, 응답 시간 | P2 |
| Usability | UX 문제 없는가 | P1 |

### 11.2 Test Cases

#### Authentication
| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-AUTH-01 | 유효한 이메일로 회원가입 | 가입 성공, 대시보드 이동 |
| TC-AUTH-02 | 중복 이메일로 회원가입 | 에러 메시지 표시 |
| TC-AUTH-03 | 잘못된 비밀번호로 로그인 | 에러 메시지 표시 |
| TC-AUTH-04 | Google OAuth 로그인 | 로그인 성공 |
| TC-AUTH-05 | 로그아웃 후 보호된 페이지 접근 | 로그인 페이지로 리다이렉트 |

#### Contracts
| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-CONT-01 | 필수 필드만으로 계약 생성 | 생성 성공, 목록에 표시 |
| TC-CONT-02 | 필수 필드 누락 시 계약 생성 | 에러 메시지 표시 |
| TC-CONT-03 | 계약 수정 | 수정된 내용 저장 |
| TC-CONT-04 | 계약 삭제 | 확인 후 삭제, 목록에서 제거 |
| TC-CONT-05 | 갱신 완료 처리 | 상태 변경, 다음 만기일 설정 |
| TC-CONT-06 | Free 플랜에서 4번째 계약 생성 | 업그레이드 안내 |

#### Notifications
| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-NOTI-01 | D-90 알림 발송 | 이메일 수신 |
| TC-NOTI-02 | 이미 발송된 알림 중복 방지 | 중복 발송 안 됨 |
| TC-NOTI-03 | 해지된 계약에 알림 | 알림 발송 안 됨 |

#### Security
| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| TC-SEC-01 | 다른 사용자의 계약 조회 | 403 Forbidden |
| TC-SEC-02 | 다른 사용자의 계약 수정 | 403 Forbidden |
| TC-SEC-03 | 인증 없이 API 호출 | 401 Unauthorized |

### 11.3 QA Checklist (Launch 전)

- [ ] 모든 P0 테스트 케이스 통과
- [ ] 크로스 브라우저 테스트 (Chrome, Safari, Firefox)
- [ ] 모바일 반응형 확인 (iOS Safari, Android Chrome)
- [ ] 이메일 발송 테스트 (Gmail, Naver 수신 확인)
- [ ] 결제 테스트 (테스트 모드)
- [ ] 에러 페이지 (404, 500) 확인
- [ ] SEO 기본 (meta tags, OG tags)
- [ ] Analytics 설치 확인

---

## 12. Technical Specifications

### 12.1 Project Structure

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── contracts/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx
│   │   │   └── billing/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── contracts/
│   │   ├── dashboard/
│   │   ├── cron/
│   │   └── payment/
│   ├── page.tsx (landing)
│   └── layout.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   └── toast.tsx
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── mobile-nav.tsx
│   ├── contracts/
│   │   ├── contract-card.tsx
│   │   ├── contract-form.tsx
│   │   └── contract-list.tsx
│   └── dashboard/
│       ├── summary-cards.tsx
│       └── upcoming-contracts.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── email/
│   │   └── resend.ts
│   ├── payment/
│   │   └── toss.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── hooks/
│   ├── use-contracts.ts
│   └── use-user.ts
└── styles/
    └── globals.css
```

### 12.2 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=

# Payment (토스페이먼츠)
TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=

# App
NEXT_PUBLIC_APP_URL=
CRON_SECRET=
```

### 12.3 Cron Job Configuration

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/send-notifications",
      "schedule": "0 9 * * *"
    }
  ]
}
```

매일 오전 9시 (KST) 실행

### 12.4 Notification Logic (Pseudocode)

```
function sendDailyNotifications():
    today = getCurrentDate()
    
    // 각 알림 타입별 처리
    for daysBeforeList in [90, 30, 7, 1]:
        targetDate = today + daysBeforeList
        
        // 해당 날짜에 만기되는 활성 계약 조회
        contracts = getActiveContractsExpiringOn(targetDate)
        
        for contract in contracts:
            // 이미 발송했는지 확인
            if hasAlreadySent(contract.id, daysBeforeList):
                continue
            
            // 이메일 발송
            sendNotificationEmail(contract, daysBeforeList)
            
            // 발송 로그 저장
            saveNotificationLog(contract.id, daysBeforeList)
```

---

## 13. Risk Management

### 13.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Supabase 장애 | 낮음 | 높음 | 에러 핸들링, 재시도 로직 |
| 이메일 발송 실패 | 중간 | 중간 | 발송 로그 확인, 재시도 |
| Cron 실행 실패 | 낮음 | 높음 | 수동 실행 백업, 모니터링 |

### 13.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| 고객 입력 안 함 | 높음 | 높음 | Concierge 온보딩 |
| "캘린더면 되는데" | 높음 | 중간 | 손실 금액 강조 메시징 |
| 낮은 전환율 | 중간 | 높음 | Free 가치 증명 후 업셀 |
| 대형 플레이어 진입 | 낮음 | 높음 | 속도 + 니치 집중 |

---

## 14. Success Metrics

### 14.1 North Star Metric
**"유료 고객의 평균 등록 계약 수"**

이유: 많이 등록할수록 → 더 많은 가치 → 낮은 Churn

### 14.2 Leading Indicators

| Metric | Target | Measurement |
|--------|--------|-------------|
| 가입 → 첫 계약 등록 | > 60% | Day 1 |
| 첫 계약 → 3개 이상 등록 | > 40% | Week 1 |
| Free → Pro 전환 | > 10% | Month 1 |
| 알림 열람률 | > 50% | Ongoing |

### 14.3 Lagging Indicators

| Metric | Target | Measurement |
|--------|--------|-------------|
| MRR | ₩4,900,000 | Month 6 |
| Churn Rate | < 5% | Monthly |
| NPS | > 40 | Quarterly |
| CAC | < ₩50,000 | Monthly |

---

## 15. Launch Checklist

### 15.1 Pre-Launch (D-7)

- [ ] 모든 기능 QA 완료
- [ ] 랜딩페이지 완성
- [ ] 도메인 연결
- [ ] SSL 인증서 확인
- [ ] 이메일 발송 테스트
- [ ] 결제 테스트 (실제 환경)
- [ ] Analytics 설치 (GA4, Mixpanel)
- [ ] Error tracking 설치 (Sentry)
- [ ] 개인정보처리방침, 이용약관

### 15.2 Launch Day (D-Day)

- [ ] Production 배포
- [ ] Cron job 활성화
- [ ] 첫 고객 10명에게 개인 연락
- [ ] 소셜 미디어 공지

### 15.3 Post-Launch (D+7)

- [ ] 첫 주 데이터 분석
- [ ] 고객 피드백 수집
- [ ] 버그 수정
- [ ] Phase 2 기획 시작

---

## 16. Development Guidelines

### 16.1 Token Efficiency (토큰 효율화)

Antigravity IDE에서 개발 시 토큰을 효율적으로 사용하기 위한 지침:

#### 언어 규칙
| 항목 | 언어 |
|------|------|
| 코드, 주석, 변수명, 커밋 메시지 | English |
| 사용자 대화, 가이드 설명, .md 문서 | 한국어 |
| UI 텍스트 (사용자에게 보이는 부분) | 한국어 |
| 에러 메시지 (console) | English |

#### 프롬프트 작성 시
```
✅ 좋은 예:
"Create contract CRUD API with Supabase"

❌ 나쁜 예:
"계약 CRUD API를 Supabase로 만들어줘. 생성, 조회, 수정, 삭제 기능이 필요하고..."
```

#### 코드 요청 시
- 한 번에 하나의 파일/기능만 요청
- 이미 작성된 코드 반복 포함하지 않기
- 변경이 필요한 부분만 명시

### 16.2 Coding Standards

#### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | ContractCard.tsx |
| Functions | camelCase | getContracts() |
| Constants | UPPER_SNAKE | MAX_FREE_CONTRACTS |
| Types | PascalCase | Contract, User |
| CSS Classes | kebab-case (Tailwind) | bg-dark-card |

#### File Organization
- 하나의 컴포넌트 = 하나의 파일
- 관련 파일은 같은 폴더에
- index.ts로 re-export

#### Code Style
- TypeScript strict mode
- ESLint + Prettier
- No any type
- Explicit return types

### 16.3 Git Workflow

#### Branch Naming
```
feature/auth-google-oauth
fix/contract-form-validation
refactor/notification-logic
```

#### Commit Message
```
feat: add contract CRUD API
fix: resolve duplicate notification issue
refactor: extract email template logic
docs: update README
```

---

## 17. Appendix

### A. Competitor Analysis

| Service | Region | Pricing | Weakness |
|---------|--------|---------|----------|
| Productiv | US | Enterprise only | 한국 미지원, 비쌈 |
| Vendr | US | Enterprise only | 한국 미지원, 비쌈 |
| Notion | Global | $8-15/user | 알림 약함, 범용 도구 |
| Google Calendar | Global | Free | 맥락 없음, 금액 관리 불가 |

**결론:** 한국 SMB 타겟 전용 솔루션 부재

### B. Glossary

| 용어 | 설명 |
|------|------|
| SaaS | Software as a Service |
| MRR | Monthly Recurring Revenue |
| Churn | 고객 이탈 |
| CAC | Customer Acquisition Cost |
| ARPU | Average Revenue Per User |
| WTP | Willingness to Pay |
| Concierge | 대신 해주는 서비스 |

### C. References

- [Supabase Docs](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Resend Email](https://resend.com/docs)
- [토스페이먼츠 개발자센터](https://docs.tosspayments.com)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02 | YJ | Initial PRD |

---

**End of Document**
