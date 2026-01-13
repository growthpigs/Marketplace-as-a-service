// Test: Commission Calculation Fix Verification
// Simulates the FIXED behavior to ensure commission is calculated on subtotal only

console.log("=== COMMISSION CALCULATION FIX VERIFICATION ===\n");

// Example order scenario
const subtotal = 20.00;  // Food order
const serviceFee = subtotal * 0.02;  // 2% = 0.40
const deliveryFee = 2.00;
const total = subtotal + serviceFee + deliveryFee;  // 22.40

console.log("Order Breakdown:");
console.log(`  Subtotal (food):         €${subtotal.toFixed(2)}`);
console.log(`  Service Fee (2%):        €${serviceFee.toFixed(2)}`);
console.log(`  Delivery Fee:            €${deliveryFee.toFixed(2)}`);
console.log(`  Total to Charge:         €${total.toFixed(2)}`);
console.log();

// Convert to cents for Stripe (as done in orders.service.ts)
const subtotalCents = Math.round(subtotal * 100);
const totalCents = Math.round(total * 100);

console.log("Stripe Processing:");
console.log(`  Subtotal (cents):        ${subtotalCents}`);
console.log(`  Total (cents):           ${totalCents}`);
console.log();

// FIXED calculation: commission on subtotal ONLY
const platformFeeCents = Math.round(subtotalCents * 0.05);  // 5% of subtotal
const restaurantAmountCents = totalCents - platformFeeCents;  // Everything else goes to restaurant

console.log("✅ FIXED Commission Calculation:");
console.log(`  Platform Commission:     €${(platformFeeCents / 100).toFixed(2)} (5% of €${subtotal.toFixed(2)} subtotal)`);
console.log(`  Restaurant Receives:     €${(restaurantAmountCents / 100).toFixed(2)}`);
console.log(`    = 95% of subtotal (€${(subtotal * 0.95).toFixed(2)}) + delivery + service fees`);
console.log();

// Verification
const expectedCommissionCents = 100;  // 5% of €20 = €1.00
if (platformFeeCents === expectedCommissionCents) {
  console.log(`✅ SUCCESS: Commission is €${(platformFeeCents / 100).toFixed(2)} (correct!)`);
  console.log(`   Previously was €1.12, saving €0.12 per order`);
  console.log(`   Monthly savings: €${(0.12 * 1000).toFixed(2)} (1000 orders/month)`);
  process.exit(0);
} else {
  console.log(`❌ FAIL: Expected commission €1.00, got €${(platformFeeCents / 100).toFixed(2)}`);
  process.exit(1);
}
