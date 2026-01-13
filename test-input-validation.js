// Test: Input Validation Vulnerability Demonstration
// Shows how attackers can manipulate prices without validation

console.log("=== INPUT VALIDATION VULNERABILITY TEST ===\n");

// Attack 1: Negative price
console.log("❌ Attack 1: Negative Unit Price");
console.log("  Client sends: { unit_price: -50, quantity: 1 }");

const buggySubtotal1 = -50 * 1;
console.log(`  Buggy code: subtotal = ${buggySubtotal1}`);
console.log(`  Result: Platform PAYS user €50 ⚠️`);
console.log();

// Attack 2: Negative quantity
console.log("❌ Attack 2: Negative Quantity");
console.log("  Client sends: { unit_price: 15, quantity: -10 }");

const buggySubtotal2 = 15 * -10;
console.log(`  Buggy code: subtotal = ${buggySubtotal2}`);
console.log(`  Result: Order total is negative, platform pays user ⚠️`);
console.log();

// Attack 3: Price doesn't match menu
console.log("❌ Attack 3: Price Mismatch");
console.log("  Menu item #1 costs €15.00");
console.log("  Client sends: { menu_item_id: 1, unit_price: 1, quantity: 1 }");
console.log(`  Buggy code: subtotal = €1.00`);
console.log(`  Result: User gets €15 item for €1 ⚠️`);
console.log();

// FIXED logic
console.log("✅ FIXED BEHAVIOR (with validation):");
console.log();

function validateOrderItems(items, menuPrices) {
  for (const item of items) {
    // Check quantity
    if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      throw new Error(`Invalid quantity: ${item.quantity}`);
    }

    // Check price is positive
    if (item.unit_price < 0) {
      throw new Error(`Invalid unit_price: ${item.unit_price}`);
    }

    // Check price matches menu
    const menuPrice = menuPrices[item.menu_item_id];
    if (!menuPrice) {
      throw new Error(`Menu item not found: ${item.menu_item_id}`);
    }
    if (Math.abs(item.unit_price - menuPrice) > 0.01) {
      throw new Error(`Price mismatch for item ${item.menu_item_id}: client sent €${item.unit_price}, menu is €${menuPrice}`);
    }
  }
}

const menuPrices = {
  '1': 15.00,
  '2': 12.50,
  '3': 10.00,
};

// Test legitimate order
try {
  const legitimateItems = [
    { menu_item_id: '1', unit_price: 15.00, quantity: 2 },
    { menu_item_id: '2', unit_price: 12.50, quantity: 1 },
  ];
  validateOrderItems(legitimateItems, menuPrices);
  const validSubtotal = (15.00 * 2) + (12.50 * 1);
  console.log(`Valid order: €${validSubtotal.toFixed(2)} ✓`);
} catch (e) {
  console.log(`Error: ${e.message}`);
}

console.log();

// Test attack - negative price
try {
  const maliciousItems = [
    { menu_item_id: '1', unit_price: -50, quantity: 1 },
  ];
  validateOrderItems(maliciousItems, menuPrices);
  console.log("❌ FAIL: Negative price accepted!");
  process.exit(1);
} catch (e) {
  console.log(`Attack blocked: ${e.message} ✓`);
}

console.log();

// Test attack - price mismatch
try {
  const maliciousItems = [
    { menu_item_id: '1', unit_price: 1.00, quantity: 1 },
  ];
  validateOrderItems(maliciousItems, menuPrices);
  console.log("❌ FAIL: Price mismatch accepted!");
  process.exit(1);
} catch (e) {
  console.log(`Attack blocked: ${e.message} ✓`);
}

console.log();
console.log("✅ SUCCESS: All input validation checks pass");
process.exit(0);
