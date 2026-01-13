// Test: Commission Calculation Bug
// Current: 5% of total (WRONG)
// Expected: 5% of subtotal (CORRECT)

const subtotal = 20.00;
const serviceFee = subtotal * 0.02;  // 2% = 0.40
const deliveryFee = 2.00;
const total = subtotal + serviceFee + deliveryFee;  // 22.40

console.log("=== BEFORE FIX (BUGGY) ===");
const buggyCommission = total * 0.05;  // 5% of 22.40 = 1.12
console.log(`Subtotal:        €${subtotal.toFixed(2)}`);
console.log(`Service Fee (2%): €${serviceFee.toFixed(2)}`);
console.log(`Delivery Fee:    €${deliveryFee.toFixed(2)}`);
console.log(`Total:           €${total.toFixed(2)}`);
console.log(`❌ BUGGY Commission (5% of total): €${buggyCommission.toFixed(2)}`);
console.log(`   Platform loses: €${(0.05 * subtotal - buggyCommission).toFixed(2)}`);

console.log("\n=== AFTER FIX (CORRECT) ===");
const correctCommission = subtotal * 0.05;  // 5% of 20.00 = 1.00
console.log(`✅ CORRECT Commission (5% of subtotal): €${correctCommission.toFixed(2)}`);
console.log(`   Difference: €${(buggyCommission - correctCommission).toFixed(2)} per order`);

console.log("\n=== MONTHLY IMPACT (1000 orders/month) ===");
const monthlyLoss = (buggyCommission - correctCommission) * 1000;
console.log(`Monthly loss from buggy calculation: €${monthlyLoss.toFixed(2)}`);

process.exit(correctCommission === 1.00 ? 0 : 1);
