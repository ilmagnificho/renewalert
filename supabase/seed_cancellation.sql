-- Top SaaS Cancellation Guides Seed
INSERT INTO public.cancellation_guides (service_name, cancellation_url, notice_period_days, steps, penalty_notes, is_annual_only)
VALUES 
('Slack', 'https://my.slack.com/admin/settings#billing', 0, '1. 관리자 메뉴 -> 설정 및 관리 -> 설정\n2. 과금 메뉴 선택\n3. 플랜 하단의 "플랜 변경" 또는 "워크스페이스 해지" 선택', '연간 결제 시 중도 해지해도 환불되지 않으며 남은 기간 동안 사용 가능합니다.', false),
('Notion', 'https://www.notion.so/billing', 0, '1. 설정 및 멤버 -> 청구\n2. 플랜 변경 또는 취소 선택', '워크스페이스 삭제와 요금제 해지는 별개입니다.', false),
('Google Workspace', 'https://admin.google.com/ac/billing/subscriptions', 30, '1. 관리 콘솔 -> 결제 -> 구독\n2. 해당 구독 선택 -> 구독 취소 선택', '연간 요금제의 경우 남은 기간에 대한 위약금이 발생할 수 있습니다.', true),
('AWS', 'https://console.aws.amazon.com/billing/home#/account', 0, '1. Billing Dashboard -> Account\n2. 하단의 "Close Account" 선택 또는 각 리소스별 중지', '리소스 삭제를 잊으면 계정 폐쇄 후에도 추가 과금이 발생할 수 있습니다.', false),
('ChatGPT', 'https://chat.openai.com/#settings/Billing', 0, '1. 설정 -> My plan -> Manage my subscription\n2. 취소 선택', '해지 즉시 혜택이 사라지지 않고 결제 주기 끝까지 유지됩니다.', false),
('Figma', 'https://www.figma.com/settings/billing', 0, '1. Admin Console -> Billing\n2. 하단의 "Cancel subscription" 선택', '팀이나 프로젝트 삭제로는 해지되지 않습니다.', false),
('Adobe', 'https://account.adobe.com/plans', 14, '1. 내 플랜 -> 플랜 관리 -> 플랜 취소\n2. 취소 사유 선택 및 확인', '최초 결제 후 14일 이후 해지 시 남은 기간 요금의 50%가 위약금으로 부과될 수 있습니다.', true),
('Github', 'https://github.com/settings/billing', 0, '1. Settings -> Billing and plans\n2. Edit -> Cancel plan', '유료 기능을 사용 중인 레포지토리가 있으면 해지가 제한될 수 있습니다.', false),
('Zoom', 'https://zoom.us/billing', 0, '1. 계정 관리 -> 청구 -> 유효한 플랜\n2. 구독 취소 선택', '자동 갱신일 최소 24시간 전에 취소해야 합니다.', false),
('Claude', 'https://claude.ai/settings/billing', 0, '1. Settings -> Billing\n2. Manage Subscription -> Cancel Plan', '구독 기간 종료 시까지 Pro 기능을 계속 사용할 수 있습니다.', false)
ON CONFLICT (service_name) DO UPDATE 
SET cancellation_url = EXCLUDED.cancellation_url,
    steps = EXCLUDED.steps,
    penalty_notes = EXCLUDED.penalty_notes;
