# Mobbin Competitive Research Summary
**Date:** 2026-01-19
**Researcher:** Chi CTO
**Focus:** Restaurant/Merchant Dashboard UI Patterns

---

## Executive Summary

Analyzed 12,500+ screens across 5 search queries on Mobbin.com. Key patterns identified for marketplace merchant dashboards, order management, and food delivery services.

---

## Search Results Overview

| Search Query | Results | Key Apps Found |
|--------------|---------|----------------|
| Uber Eats Manager | 2,505 | Uber, Uber Eats, OpenTable |
| Restaurant Manager | 2,500 | OpenTable, 7shifts |
| Merchant Dashboard | 2,500 | Shopify, Etsy, Fiverr, Square |
| Deliveroo | 2,574 | Sweetgreen, Uber Eats |
| Food Delivery Dashboard | 2,500 | Blue Apron |
| **DoorDash Merchant Portal** | 2,500 | DoorDash Business |
| Order Management Kitchen | 2,500 | Lemon Squeezy, Coinbase, Eventbrite, Square |

---

## Key UI Patterns by Category

### 1. Dashboard Metrics (KPIs)

**Shopify Pattern:**
- Total Sessions, Total Sales, Orders to fulfill
- Sales breakdown by channel
- Top products list
- Time-series revenue graphs

**Etsy Shop Manager Pattern:**
- Visits, Orders, Conversion rate, Revenue
- Shopper Stats: Item favourites, Shop followers, Reviews
- Line graph for traffic over time
- Date range selector (Last 7 Days)

**Square Pattern:**
- Total Sales, Transactions, Refunds
- Customers: Total, Returning, Avg visits
- Payment method breakdown

**Fiverr Pattern:**
- Earnings to date, Avg selling price, Orders completed
- Overview vs Repeat business tabs
- Time series (Last 30 days)

### 2. Navigation Patterns

**Sidebar Navigation (Common):**
```
├── Home/Dashboard
├── Orders
├── Products/Listings
├── Customers
├── Analytics/Stats
├── Marketing
├── Finances
├── Settings
└── Help
```

**Etsy Extended Sidebar:**
- Messages
- Orders & Delivery
- Star Seller (badge/status)
- Growth & See
- Integrations

**OpenTable Restaurant Nav:**
- Reservations
- Operations
- Experiences
- Reputation
- Relationships

### 3. Order Management

**Order Status Flow:**
```
Received → Preparing → Out for Delivery → Delivered
```

**Order List Components:**
- Order ID/number
- Customer name
- Items summary
- Total amount
- Status badge
- Time since order
- Action buttons (Accept, Reject, Mark Ready)

**Delivery Tracking:**
- Map view with driver location
- ETA countdown
- Driver info card (name, vehicle, photo)
- In-app chat/messaging
- PIN verification

### 4. Menu/Product Management

**Item Card Components:**
- Product image
- Name/title
- Price
- Description
- Category tags
- Availability toggle
- Edit/Delete actions

**Bulk Actions:**
- Select all
- Mark unavailable
- Update prices
- Duplicate

### 5. Analytics & Reporting

**Time Range Selectors:**
- Today, Yesterday, Last 7 days, Last 30 days
- Custom date range picker

**Chart Types Used:**
- Line graphs (revenue over time)
- Bar charts (orders by day)
- Donut/pie (breakdown by category)
- Metric cards with trend indicators

**Export Options:**
- CSV download
- PDF reports
- Share via email

### 6. Onboarding Flows

**Shopify New Seller:**
- "Congratulations on your 1st order" celebration
- Progress checklist
- Bookmark store URL

**Etsy New Seller:**
- "A quick guide to getting your first sale"
- Illustrated step-by-step
- Progress indicators

**Square Merchant Setup:**
- "Get set up to bill clients"
- Get approved to accept payments
- Take a payment tutorial

**Blue Apron Subscriber:**
- "Congrats! You've started your subscription"
- Preselected recipes explanation
- CHOOSE RECIPES CTA

### 7. AI/Smart Insights

**Etsy Shop Insights:**
- "Art & Collectibles with video got 2x more orders"
- Data-driven recommendations
- "More growth resources" content hub

**Content Marketing Integrations:**
- Ultimate Guide to Pricing
- Creating Listings That Convert
- Case Study formats

### 8. Delivery Options UI

**Dropoff Options (Uber Eats):**
- Hand it to me
- Meet at my door (default)
- Meet outside
- Meet in the lobby
- Leave at location

**Delivery Instructions:**
- Free-text field
- Example: "Please knock instead of using the doorbell"

**Scheduling:**
- Deliver now (default)
- Schedule: Date + Time range picker
- Priority vs Standard options

### 9. Communication Patterns

**In-App Chat:**
- Real-time messaging with driver
- Quick reply suggestions
- PIN verification messages
- Read receipts

**Notifications:**
- Order received
- Driver assigned
- Almost here
- Delivered

### 10. DoorDash Business Portal (B2B)

**Navigation Sidebar:**
```
├── Home
├── Grocery
├── Retail
├── Convenience
├── Alcohol
├── Catering
├── DashMart
├── Beauty
├── Pets
├── Health
├── Browse All
├── Orders
└── Account
```

**Business Profile Setup Flow:**
1. Create business profile modal
2. Set work email (optional)
3. Select payment method (Visa, Credit/Debit, PayPal, Venmo, Cash App Pay, Klarna, HSA/FSA)
4. "You're all set!" success with progress indicator
5. Link expense provider (optional)

**Expense Provider Integrations:**
- Brex
- Concur
- Emburse Enterprise/Professional/Spend
- Expensify
- Ramp

**Account Features:**
- DoorDash Credits display ($0.00)
- Payment frequency selector ("Once a day")
- Gift card redemption
- Referral program ("Invite friends")
- Order status updates via text toggle

### 11. Payment & Checkout

**Order Total Breakdown:**
```
Subtotal:           $32.40
Delivery Fee:        $1.49
Delivery Discount:  -$1.49
Taxes & Other Fees:  $4.21
─────────────────────────
Total:             $36.61
```

**Subscription Credits:**
- Credit balance display
- "X days left of Uber One benefits"

---

## Apps Analyzed

### Restaurant Management
1. **OpenTable for Restaurants** - Reservations, operations, CRM, floor plans
2. **7shifts** - Team scheduling, labor management, tip tracking

### E-commerce/Merchant Dashboards
3. **Shopify** - Full merchant dashboard with KPIs
4. **Etsy** - Shop Manager with AI insights
5. **Fiverr** - Seller analytics
6. **Square** - Payments + invoicing + order management
7. **Lemon Squeezy** - Digital products order management

### Food Delivery (B2B/Business)
8. **DoorDash Business** - Corporate ordering, expense integrations
9. **Blue Apron** - Subscription management, meal selection

### Food Delivery (Consumer)
10. **Uber Eats** - Ordering, tracking, delivery, group orders
11. **Sweetgreen** - Order tracking with driver chat

### Events & Tickets
12. **Eventbrite** - Event order management, refunds

---

## Key Takeaways for MaaS Implementation

### Must-Have Features
1. **Dashboard with KPIs** - Orders today, Revenue, Conversion rate
2. **Order queue** with status badges and action buttons
3. **Menu/inventory management** with availability toggles
4. **Analytics** with time-range selectors and exportable reports
5. **Notification system** for new orders

### Nice-to-Have Features
1. AI-powered insights ("Your X products get Y% more orders")
2. Team/staff scheduling integration
3. In-app messaging with customers
4. Promotional tools (discounts, featured items)

### UI/UX Patterns to Adopt
1. **Sidebar navigation** with collapsible sections
2. **Metric cards** with trend indicators (↑ 12%)
3. **Status badges** with color coding (green=complete, yellow=preparing, blue=delivery)
4. **Toast notifications** for success/error states
5. **Empty states** with clear CTAs
6. **Onboarding checklists** for new merchants

---

## Screenshot References

All screenshots captured during this research session are available for reference.
Session screenshot IDs captured:
- ss_5678gm21i - Uber Eats Manager search
- ss_6885pmcqh - Restaurant manager (OpenTable)
- ss_4941n11pg - Merchant dashboard (Shopify, Etsy)
- ss_8810s0is3 - Deliveroo/delivery tracking
- ss_5911gien8 - Food delivery dashboard (Blue Apron)
- ss_3178v5tgy - DoorDash merchant portal (orders, profile)
- ss_3609u747g - DoorDash group ordering
- ss_9963g9rbo - Order management (Lemon Squeezy, Coinbase, Eventbrite)

---

## Next Steps

1. [ ] Create wireframes based on these patterns
2. [ ] Prioritize features for MVP merchant dashboard
3. [ ] Design system with status badges, metric cards, nav patterns
4. [ ] User flow diagrams for key journeys

---

*Research conducted via Mobbin.com - UI/UX pattern library*
