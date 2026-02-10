# Supabase 인증 한도 초과 오류 해결 방법

## 원인 (Issue)
데모 로그인 시 "Too many requests" 또는 "Rate limit exceeded" 오류가 발생하는 이유는, Supabase 보안 정책상 공용 데모 계정(`public_demo`)으로 단시간에 너무 많은 로그인/회원가입 시도가 있었기 때문입니다.

## 해결 방법 (Solution)

### 1단계: "공용 데모 유저" 삭제하기 (가장 확실한 방법)
데모 계정을 삭제하면 모든 제한이 초기화됩니다.

1. **Supabase 대시보드**에 접속합니다.
2. 왼쪽 메뉴에서 **Authentication** > **Users**를 클릭합니다.
3. 목록에서 `public_demo@renewalert.com`을 찾습니다.
4. 우측 끝의 **점 3개 버튼**을 눌러 **Delete user**를 선택하고 삭제합니다.

### 2단계: 이메일 인증 끄기 (권장)
"계정은 생성됐지만 이메일 미인증" 상태를 방지하기 위해 설정을 변경합니다.

1. **Authentication** > **Providers** > **Email** 메뉴로 이동합니다.
2. **Confirm email** 옵션을 **Check 해제(끄기)** 합니다.
3. **Save**를 눌러 저장합니다.

### 3단계: 다시 시도
이제 앱으로 돌아와 **"체험하기"** 버튼을 누르면 정상적으로 계정이 다시 생성(`demo1234`)되고 로그인이 완료됩니다.

