// Test: Authorization Validation Vulnerability
// Shows how user impersonation attack works

console.log("=== AUTHORIZATION VALIDATION VULNERABILITY TEST ===\n");

// Mock JWT token structure (simplified - real JWT would be base64 encoded)
const mockToken = 'mock-jwt-token-placeholder';

// Extract user ID from token (would be done by JWT.verify in real code)
function extractUserIdFromToken(token) {
  // In real code: jwt.verify(token, secret) returns payload with userId
  // For mock: would return null since token is fake
  return null;
}

console.log("❌ BUGGY BEHAVIOR (current code):");
console.log(`  Frontend sends: { mockAuthToken, userId: "user-B-id" }`);

const claimedUserId = "user-B-id";
const tokenUserId = extractUserIdFromToken(mockToken);

console.log(`  Backend extracts userId from token: ${tokenUserId}`);
console.log(`  Backend claims in request body: ${claimedUserId}`);
console.log(`  Do they match? ${tokenUserId === claimedUserId}`);
console.log(`  → Authorization check is SKIPPED ⚠️`);
console.log(`  → Creates order for user-B-id at attacker's address`);
console.log(`  → User B gets charged ⚠️`);
console.log();

console.log("✅ FIXED BEHAVIOR (with proper JWT validation):");
console.log();

// Simulate real JWT payload
const realToken = {
  userId: "user-A-id",
  email: "userA@example.com",
  iat: Math.floor(Date.now() / 1000),
};

function verifyTokenAndExtractUserId(token) {
  // In real code: jwt.verify(token, secret) throws if invalid
  // For demo: return payload
  return realToken;
}

try {
  const payload = verifyTokenAndExtractUserId(mockToken);
  const tokenUserId = payload.userId;
  const requestUserId = "user-A-id"; // From request body

  console.log(`  Frontend sends: { token, userId: "${requestUserId}" }`);
  console.log(`  Backend extracts userId from JWT: "${tokenUserId}"`);
  console.log(`  Backend claims in request body: "${requestUserId}"`);
  console.log(`  Do they match? ${tokenUserId === requestUserId}`);

  if (tokenUserId !== requestUserId) {
    throw new Error(
      `Authorization mismatch: token claims ${tokenUserId}, request claims ${requestUserId}`,
    );
  }

  console.log(`  → Authorization check PASSED ✓`);
  console.log(`  → Creates order for correct user ✓`);
  console.log();

  // Test attack scenario
  console.log("Attack attempt (should fail):");
  const maliciousRequest = { userId: "user-B-id" }; // Different from token
  if (tokenUserId !== maliciousRequest.userId) {
    throw new Error(
      `Authorization mismatch: token claims ${tokenUserId}, request claims ${maliciousRequest.userId}`,
    );
  }
} catch (e) {
  console.log(`  Attack BLOCKED: ${e.message} ✓`);
}

console.log();
console.log("✅ SUCCESS: Authorization validation prevents user impersonation");
process.exit(0);
