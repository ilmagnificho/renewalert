# Supabase Auth Rate Limit Troubleshooting

## Issue
Demo Login fails with "Too many requests" or "Rate limit exceeded".
This happens because `public_demo@renewalert.com` has hit the maximum signup/login attempts allowed by Supabase's security settings.

## Solution

### 1. Delete the "Corrupted" User
The easiest fix is to delete the demo user so it can be re-created cleanly.

1. Go to your **Supabase Dashboard**.
2. Navigate to **Authentication** > **Users**.
3. Find `public_demo@renewalert.com`.
4. Click the **Delete** button (row menu).
5. Confirm deletion.

### 2. Disable Email Confirmation (Recommended for Demo)
To prevent "User created but email not confirmed" issues:

1. Go to **Authentication** > **Providers** > **Email**.
2. Uncheck **Confirm email**.
3. Save changes.

### 3. Try Demo Button Again
Now click the **Demo Button** in your app. It will:
- Sign Up a new user `public_demo@renewalert.com` with password `demo1234`.
- Log them in automatically.
