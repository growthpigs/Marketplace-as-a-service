#!/bin/bash
# TurkEats Pre-Commit Sanity Check
# Run this BEFORE every commit to catch issues early
#
# Usage: ./scripts/pre-commit-check.sh [--fix] [--skip-tests]
#   --fix        Auto-fix lint issues where possible
#   --skip-tests Skip running tests (faster, but less thorough)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Parse arguments
FIX_MODE=""
SKIP_TESTS=false

for arg in "$@"; do
  case $arg in
    --fix)
      FIX_MODE="--fix"
      ;;
    --skip-tests)
      SKIP_TESTS=true
      ;;
  esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  TurkEats Pre-Commit Sanity Check${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

FAILED=0

# Function to run a check
run_check() {
  local name="$1"
  local cmd="$2"
  local dir="$3"

  echo -e "${YELLOW}[$name]${NC} Running..."

  if [ -n "$dir" ]; then
    cd "$PROJECT_ROOT/$dir"
  fi

  if eval "$cmd" > /tmp/precommit_output.txt 2>&1; then
    echo -e "${GREEN}[$name]${NC} PASS"
    cd "$PROJECT_ROOT"
    return 0
  else
    echo -e "${RED}[$name]${NC} FAIL"
    cat /tmp/precommit_output.txt
    cd "$PROJECT_ROOT"
    FAILED=1
    return 1
  fi
}

# ============================================
# 1. CHECK FOR SECRETS IN STAGED FILES
# ============================================
echo -e "\n${BLUE}--- Step 1: Secrets Detection ---${NC}"

STAGED_FILES=$(git diff --cached --name-only 2>/dev/null || echo "")

if [ -n "$STAGED_FILES" ]; then
  # Check for common secret patterns
  SECRET_PATTERNS=(
    "SUPABASE.*KEY.*=.*ey"
    "password.*=.*['\"]"
    "secret.*=.*['\"]"
    "api_key.*=.*['\"]"
    "AWS_SECRET"
    "PRIVATE_KEY"
    "Bearer ey"
  )

  SECRETS_FOUND=false
  for pattern in "${SECRET_PATTERNS[@]}"; do
    # Exclude: .env.example, .md docs, .sh scripts (they contain pattern definitions)
    MATCHES=$(echo "$STAGED_FILES" | xargs grep -l -i -E "$pattern" 2>/dev/null | grep -v ".env.example" | grep -v ".md" | grep -v ".sh" || true)
    if [ -n "$MATCHES" ]; then
      echo -e "${RED}[SECRETS]${NC} Potential secret found matching: $pattern"
      echo "$MATCHES"
      SECRETS_FOUND=true
    fi
  done

  # Check if .env files are staged (they shouldn't be!)
  if echo "$STAGED_FILES" | grep -E "^apps/.*\.env$|^\.env$" > /dev/null; then
    echo -e "${RED}[SECRETS]${NC} WARNING: .env file is staged for commit!"
    echo "$STAGED_FILES" | grep -E "\.env$"
    SECRETS_FOUND=true
  fi

  if [ "$SECRETS_FOUND" = true ]; then
    echo -e "${RED}[SECRETS]${NC} FAIL - Review staged files for secrets"
    FAILED=1
  else
    echo -e "${GREEN}[SECRETS]${NC} PASS - No secrets detected"
  fi
else
  echo -e "${YELLOW}[SECRETS]${NC} No staged files to check"
fi

# ============================================
# 2. TYPESCRIPT TYPE CHECKS
# ============================================
echo -e "\n${BLUE}--- Step 2: TypeScript Type Checks ---${NC}"

run_check "API TypeScript" "npx tsc --noEmit" "apps/api"
run_check "Mobile TypeScript" "npx tsc --noEmit" "apps/mobile"
run_check "Dashboard TypeScript" "npx tsc --noEmit" "apps/restaurant-dashboard"

# ============================================
# 3. LINTING
# ============================================
echo -e "\n${BLUE}--- Step 3: Linting ---${NC}"

run_check "API Lint" "npm run lint $FIX_MODE" "apps/api" || true
run_check "Dashboard Lint" "npm run lint $FIX_MODE" "apps/restaurant-dashboard" || true

# ============================================
# 4. TESTS (if not skipped)
# ============================================
if [ "$SKIP_TESTS" = false ]; then
  echo -e "\n${BLUE}--- Step 4: Tests ---${NC}"

  # Only run if tests exist
  if [ -d "apps/api/test" ] || [ -f "apps/api/jest.config.js" ]; then
    run_check "API Tests" "npm test -- --passWithNoTests" "apps/api" || true
  else
    echo -e "${YELLOW}[API Tests]${NC} No tests configured yet"
  fi
else
  echo -e "\n${YELLOW}--- Step 4: Tests SKIPPED ---${NC}"
fi

# ============================================
# 5. BUILD CHECK (Dashboard only - fastest)
# ============================================
echo -e "\n${BLUE}--- Step 5: Build Verification ---${NC}"

run_check "Dashboard Build" "npm run build" "apps/restaurant-dashboard"

# ============================================
# 6. DEPENDENCY CHECK
# ============================================
echo -e "\n${BLUE}--- Step 6: Dependency Check ---${NC}"

# Check for outdated packages with security issues
if command -v npm &> /dev/null; then
  echo -e "${YELLOW}[Dependencies]${NC} Checking for vulnerabilities..."
  cd "$PROJECT_ROOT/apps/api"
  npm audit --audit-level=high > /tmp/audit_output.txt 2>&1 || true

  if grep -q "found 0 vulnerabilities" /tmp/audit_output.txt; then
    echo -e "${GREEN}[API Dependencies]${NC} No high/critical vulnerabilities"
  else
    HIGH_COUNT=$(grep -oE "[0-9]+ high" /tmp/audit_output.txt | head -1 || echo "0 high")
    CRIT_COUNT=$(grep -oE "[0-9]+ critical" /tmp/audit_output.txt | head -1 || echo "0 critical")
    echo -e "${YELLOW}[API Dependencies]${NC} $HIGH_COUNT, $CRIT_COUNT vulnerabilities"
  fi
  cd "$PROJECT_ROOT"
fi

# ============================================
# 7. STAGED DIFF REVIEW
# ============================================
echo -e "\n${BLUE}--- Step 7: Staged Changes Summary ---${NC}"

if [ -n "$STAGED_FILES" ]; then
  FILE_COUNT=$(echo "$STAGED_FILES" | wc -l | tr -d ' ')
  echo -e "Files staged for commit: ${YELLOW}$FILE_COUNT${NC}"
  echo "$STAGED_FILES" | head -20
  if [ "$FILE_COUNT" -gt 20 ]; then
    echo "... and $((FILE_COUNT - 20)) more files"
  fi

  # Show diff stats
  echo ""
  git diff --cached --stat | tail -5
else
  echo -e "${YELLOW}No files staged for commit${NC}"
  echo "Run 'git add <files>' to stage changes"
fi

# ============================================
# FINAL RESULT
# ============================================
echo -e "\n${BLUE}========================================${NC}"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}  ALL CHECKS PASSED${NC}"
  echo -e "${GREEN}  Safe to commit!${NC}"
  echo -e "${BLUE}========================================${NC}"
  exit 0
else
  echo -e "${RED}  SOME CHECKS FAILED${NC}"
  echo -e "${RED}  Fix issues before committing${NC}"
  echo -e "${BLUE}========================================${NC}"
  exit 1
fi
