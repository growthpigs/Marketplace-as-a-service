# TurkEats Operations Runbook

**Created:** 2026-01-13
**Purpose:** Verification commands and operational procedures
**Rule:** Run these commands FIRST before assuming anything works

---

## Verification Commands

### 1. Expo Dev Server Health Check

```bash
# Check if Expo is running on expected port
lsof -i :8082 | head -3

# Expected: node or expo process on port 8082
# If empty: npx expo start --web --port 8082
```

### 2. API Server Health Check

```bash
# Test API is responding
curl -s http://localhost:3000/health | jq .

# Expected: { "status": "ok" }
# If error: cd apps/api && npm run dev
```

### 3. Supabase Connection Test (RUNTIME, not file existence)

```bash
# Don't just check if .env exists - PROVE it works
source apps/api/.env.local 2>/dev/null || source apps/api/.env

curl -s "$SUPABASE_URL/rest/v1/health" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY"

# Expected: HTTP 200 with data
# If 401/403: Check credentials are valid (not placeholders)
```

### 4. Order Endpoint Test (Demo Mode)

```bash
# Test checkout demo mode is working
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{
    "restaurant_id": "test-123",
    "delivery_address": {"formatted": "123 Test St"},
    "items": [{"menu_item_id": "item-1", "quantity": 1, "unit_price": 10.00}]
  }'

# Expected: Order created or demo response
```

### 5. TypeScript Compilation Check

```bash
# Verify no type errors across monorepo
cd /Users/rodericandrews/_PAI/projects/marketplace-as-a-service

# API
npx tsc --noEmit -p apps/api/tsconfig.json

# Mobile
npx tsc --noEmit -p apps/mobile/tsconfig.json

# Expected: No output (success) or specific errors to fix
```

### 6. Mobile App Tab Verification

```bash
# Verify all tabs are navigable (web test)
curl -s http://localhost:8082 | grep -c "tabs"

# Better: Open in browser and visually verify each tab responds to clicks
```

---

## Critical Patterns (DO NOT REGRESS)

### Browse → Home Navigation

The Browse tab navigates to Home with URL params. This pattern MUST be preserved:

```typescript
// browse.tsx - Navigating with params
router.push({
  pathname: '/',
  params: { collection: collectionId }
});

// index.tsx - Reading params and applying filters
const params = useLocalSearchParams<{ category?: string; collection?: string }>();

useEffect(() => {
  if (params.category) setSelectedCategory(params.category);
  if (params.collection) {
    // Apply appropriate filter based on collection
  }
}, [params.category, params.collection]);
```

### Demo Mode Checkout

The checkout flow works without backend in demo mode:

```typescript
// review.tsx - Demo mode detection
const isDemoMode = Constants.expoConfig?.extra?.ENV === 'development';

if (isDemoMode) {
  // Skip real API call, simulate success
  await new Promise(resolve => setTimeout(resolve, 1500));
  router.push({ pathname: '/checkout/confirmation', params: { orderId: mockOrderId } });
}
```

---

## Startup Checklist

Before working on this project, verify:

```
□ 1. Git branch: main or feature branch? (git branch --show-current)
□ 2. Expo server running? (lsof -i :8082)
□ 3. API server running? (curl localhost:3000/health)
□ 4. .env files have REAL values (not placeholders)?
□ 5. TypeScript compiles? (npx tsc --noEmit)
□ 6. Last commit synced? (git status)
```

---

## Common Issues & Fixes

### Port Already in Use

```bash
# Find and kill process on port
lsof -ti :8082 | xargs kill -9
```

### Expo Metro Bundler Stuck

```bash
# Clear Metro cache and restart
npx expo start --clear --port 8082
```

### Pre-commit Hook Failing (Secrets Detection)

The hook flags `SUPABASE.*KEY.*=.*ey` pattern. If it's a false positive (just referencing env var names, not actual keys), exclude the file:

```bash
git reset HEAD apps/api/src/lib/supabase.ts
git checkout apps/api/src/lib/supabase.ts
git commit  # Without the flagged file
```

---

## Related Documents

- `working/handover.md` - Session continuity
- `working/active-tasks.md` - Current work focus
- `features/INDEX.md` - Feature status + Demo Mode section
- `~/.claude/troubleshooting/error-patterns.md` - Global error patterns
