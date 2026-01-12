# Acceptance Criteria

**Project:** TurkEats
**Created:** 2026-01-12
**Status:** Draft

---

## Feature: User Registration

### Scenario: Successful Registration
**Given** I am a new user on the registration screen
**When** I enter valid email, phone, and password
**Then** I receive a verification code
**And** After verification, my account is created
**And** I am assigned a unique referral code

### Scenario: Registration with Referral
**Given** I have a friend's referral code
**When** I enter it during registration
**Then** My account is linked to the referrer
**And** The referrer is notified of new signup

---

## Feature: Restaurant Search

### Scenario: Location-Based Search
**Given** I have granted location permission
**When** I open the app
**Then** I see restaurants within 5km
**And** They are sorted by recommended order

### Scenario: Filter by Category
**Given** I am on the restaurant list
**When** I tap "Assiette Grec" category
**Then** Only restaurants with that category show
**And** Count updates to show filtered results

---

## Feature: Order Placement

### Scenario: Add to Cart
**Given** I am viewing a menu item
**When** I tap "Add to Cart"
**Then** Item is added with quantity 1
**And** Cart icon shows item count

### Scenario: Checkout
**Given** I have items in cart
**When** I tap "Checkout"
**Then** I see order summary with fees
**And** I can enter delivery address
**And** I can proceed to payment

---

## Feature: Cashback

### Scenario: Earn Cashback
**Given** I placed an order for €20
**When** Order is marked delivered
**Then** €2.00 (10%) is credited to my wallet
**And** I see notification of cashback

### Scenario: Use Cashback
**Given** I have €5 wallet balance
**When** I checkout a €15 order
**Then** I can apply wallet balance
**And** I pay only €10

---

## Related Documents

- [USER-STORIES.md](USER-STORIES.md)
- [FSD.md](FSD.md)
