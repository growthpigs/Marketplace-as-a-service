# Wave 1 Worker Prompts

**Dependencies:** Wave 0 (Scaffolding) ✅ Complete
**Can Run:** NOW

---

## Worker W1-AUTH: F001 Authentication

**Open a new Warp tab, run `claude`, then paste:**

```
You are Chi CTO Worker W1-AUTH.

PROJECT: TurkEats (marketplace-as-a-service)
FEATURE: F001 - Customer Registration & Authentication
SPEC: Read features/F001-auth.md for full requirements

YOUR TASK:
1. Read the spec at features/F001-auth.md
2. Implement phone-based auth using Supabase Auth
3. Work in apps/mobile/ (Expo React Native)
4. Create these files:
   - app/(auth)/_layout.tsx - Auth flow layout
   - app/(auth)/welcome.tsx - Welcome screen
   - app/(auth)/phone.tsx - Phone number entry
   - app/(auth)/verify.tsx - OTP verification
   - lib/supabase.ts - Supabase client config
   - lib/auth/auth-provider.tsx - Auth context
   - hooks/useAuth.ts - Auth hook

5. When complete, write status to: .chi-cto/workers/w1-auth/status.json

CONSTRAINTS:
- Use TypeScript strict mode
- Use Zustand for state (already in stack)
- Supabase for auth (assume project exists)
- Do NOT touch other feature areas
- Push a PR when done, don't merge

START by reading the spec, then begin implementation.
```

---

## Worker W1-RESTAURANT: F011 Restaurant Dashboard

**Open another Warp tab, run `claude`, then paste:**

```
You are Chi CTO Worker W1-RESTAURANT.

PROJECT: TurkEats (marketplace-as-a-service)
FEATURE: F011 - Restaurant Dashboard
SPEC: Read features/F011-restaurant-dashboard.md for full requirements

YOUR TASK:
1. Read the spec at features/F011-restaurant-dashboard.md
2. Build the restaurant dashboard web app
3. Work in apps/restaurant-dashboard/ (Next.js)
4. Create these pages/components:
   - app/(auth)/login/page.tsx - Restaurant login
   - app/(dashboard)/orders/page.tsx - Order management
   - app/(dashboard)/menu/page.tsx - Menu editor
   - app/(dashboard)/settings/page.tsx - Restaurant settings
   - components/OrderCard.tsx - Order display component
   - components/MenuItemForm.tsx - Menu item editor
   - lib/supabase.ts - Supabase client

5. When complete, write status to: .chi-cto/workers/w1-restaurant/status.json

CONSTRAINTS:
- Use TypeScript strict mode
- Use shadcn/ui for components (install if needed)
- Tailwind CSS for styling
- Supabase for data (assume project exists)
- Do NOT touch mobile app
- Push a PR when done, don't merge

START by reading the spec, then begin implementation.
```

---

## How to Start Wave 1

1. **Open Warp terminal**
2. **Split into 2 tabs** (Cmd+T)
3. **In each tab:**
   ```bash
   cd /Users/rodericandrews/_PAI/projects/marketplace-as-a-service
   claude
   ```
4. **Paste the respective worker prompt**
5. **Let them run in parallel**

## Monitor Progress

Check worker status:
```bash
cat .chi-cto/workers/w1-auth/status.json
cat .chi-cto/workers/w1-restaurant/status.json
```
