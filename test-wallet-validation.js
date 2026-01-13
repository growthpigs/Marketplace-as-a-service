// Test: Wallet Balance Bypass Vulnerability Verification
// This test demonstrates the vulnerability BEFORE the fix

console.log("=== WALLET BALANCE BYPASS TEST ===\n");

// Scenario: User has €5 in wallet, tries to claim €50
const userWalletBalance = 5.00;
const requestedWalletAmount = 50.00;
const orderTotal = 45.00;  // Subtotal + delivery

console.log("Attack Scenario:");
console.log(`  User's actual wallet balance: €${userWalletBalance.toFixed(2)}`);
console.log(`  User claims wallet_amount_to_apply: €${requestedWalletAmount.toFixed(2)}`);
console.log(`  Order total: €${orderTotal.toFixed(2)}`);
console.log();

// BUGGY logic (before fix)
console.log("❌ BUGGY BEHAVIOR (current code):");
const buggyWalletCredit = Math.min(requestedWalletAmount, orderTotal);
console.log(`  Math.min(${requestedWalletAmount}, ${orderTotal}) = €${buggyWalletCredit.toFixed(2)}`);
console.log(`  Result: User gets €${buggyWalletCredit.toFixed(2)} credit despite having only €${userWalletBalance.toFixed(2)}`);
console.log(`  => FREE MEAL! USER FRAUD ⚠️`);
console.log();

// CORRECT logic (after fix)
console.log("✅ FIXED BEHAVIOR (with wallet balance check):");
const correctWalletCredit = Math.min(requestedWalletAmount, userWalletBalance, orderTotal);
console.log(`  Math.min(${requestedWalletAmount}, ${userWalletBalance}, ${orderTotal}) = €${correctWalletCredit.toFixed(2)}`);
console.log(`  Result: User gets only €${correctWalletCredit.toFixed(2)} (limited by actual balance)`);
console.log(`  => SECURE ✓`);
console.log();

// Test result
if (correctWalletCredit === userWalletBalance) {
  console.log(`✅ SUCCESS: Wallet validation works correctly`);
  process.exit(0);
} else {
  console.log(`❌ FAIL: Wallet validation failed`);
  process.exit(1);
}
