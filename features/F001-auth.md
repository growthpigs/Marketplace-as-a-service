# F001 - Customer Registration & Authentication

**ID:** F001
**Priority:** P0 (MVP)
**Status:** Spec Complete
**Estimate:** 3 DU

---

## Overview

User registration and authentication for the TurkEats customer app. Supports phone-based auth (primary) and social login (secondary). Uses Supabase Auth.

---

## User Stories

### US-001: Phone Registration
```
As a new user
I want to register with my phone number
So I can start ordering food

Acceptance Criteria:
- [ ] Enter phone number (+33 France format)
- [ ] Receive SMS verification code (Twilio)
- [ ] Enter 6-digit code
- [ ] Create profile (name, email optional)
- [ ] Auto-generate referral code
```

### US-002: Phone Login
```
As a returning user
I want to log in with my phone number
So I can access my account

Acceptance Criteria:
- [ ] Enter phone number
- [ ] Receive SMS code
- [ ] Auto-login on code verification
- [ ] Remember device (optional)
```

### US-003: Social Login
```
As a user
I want to log in with Google/Apple
So I can register faster

Acceptance Criteria:
- [ ] Google Sign-In button
- [ ] Apple Sign-In button (iOS required)
- [ ] Link social account to existing phone account
- [ ] Request phone number after social login (for orders)
```

### US-004: Session Management
```
As a logged-in user
I want my session to persist
So I don't have to log in repeatedly

Acceptance Criteria:
- [ ] JWT access token (15min expiry)
- [ ] Refresh token (30 days)
- [ ] Auto-refresh on app open
- [ ] Force logout on password change
```

---

## Technical Specification

### Stack
- **Auth Provider:** Supabase Auth
- **SMS:** Twilio Verify API
- **Social:** Google Sign-In, Apple Sign-In
- **Token Storage:** Flutter Secure Storage

### API Endpoints

```typescript
// POST /auth/phone/send-code
Request: { phone: "+33612345678" }
Response: { success: true, expiresIn: 300 }

// POST /auth/phone/verify
Request: { phone: "+33612345678", code: "123456" }
Response: { accessToken: "...", refreshToken: "...", user: {...} }

// POST /auth/social
Request: { provider: "google", idToken: "..." }
Response: { accessToken: "...", refreshToken: "...", user: {...} }

// POST /auth/refresh
Request: { refreshToken: "..." }
Response: { accessToken: "...", refreshToken: "..." }

// POST /auth/logout
Request: {} (with Bearer token)
Response: { success: true }
```

### Database Schema

```sql
-- Extends Supabase auth.users
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  phone VARCHAR(20) UNIQUE,
  display_name VARCHAR(100),
  email VARCHAR(255),
  avatar_url TEXT,
  referral_code VARCHAR(10) UNIQUE NOT NULL,
  referred_by UUID REFERENCES public.user_profiles(id),
  wallet_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := UPPER(SUBSTR(MD5(NEW.id::text), 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Flutter Implementation

```dart
// lib/features/auth/providers/auth_provider.dart
@riverpod
class Auth extends _$Auth {
  @override
  Future<User?> build() async {
    return supabase.auth.currentUser;
  }

  Future<void> sendPhoneCode(String phone) async {
    await supabase.auth.signInWithOtp(phone: phone);
  }

  Future<void> verifyPhoneCode(String phone, String code) async {
    await supabase.auth.verifyOTP(
      phone: phone,
      token: code,
      type: OtpType.sms,
    );
    state = AsyncData(supabase.auth.currentUser);
  }
}
```

---

## UI Screens

1. **Welcome Screen** - App intro + "Get Started" CTA
2. **Phone Entry** - Phone number input with country picker
3. **OTP Verification** - 6-digit code input with countdown
4. **Profile Setup** - Name entry (post-verification)
5. **Social Login** - Alternative auth options

---

## Dependencies

- Supabase project configured
- Twilio Verify API key
- Google OAuth credentials
- Apple Sign-In setup (Apple Developer account)

---

## Security Considerations

- Rate limit SMS sends (3/hour per number)
- OTP expires after 5 minutes
- Secure token storage (not SharedPreferences)
- Phone number validation (libphonenumber)

---

## Testing Checklist

- [ ] New user phone registration flow
- [ ] Returning user phone login
- [ ] Invalid OTP handling
- [ ] Expired OTP handling
- [ ] Google Sign-In flow
- [ ] Apple Sign-In flow
- [ ] Session persistence after app restart
- [ ] Token refresh mechanism
- [ ] Rate limiting verification
