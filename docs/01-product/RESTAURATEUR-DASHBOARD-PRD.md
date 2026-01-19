# TurkEats Restaurateur Dashboard - Product Requirements Document

**Version:** 1.0
**Date:** 2026-01-19
**Author:** Chi CTO (PAI v2)
**Status:** Draft - Awaiting Stakeholder Review
**Platform Priority:** Mobile 90% | Web 10% | Tablet minimal

---

## Executive Summary

The Restaurateur Dashboard is the operational backbone of TurkEats - the interface through which Turkish restaurant and kebab shop owners manage their orders, menu, earnings, and customer relationships. Unlike the consumer-facing app (already demonstrated to stakeholders), this dashboard is designed **mobile-first** to match the reality of how small restaurant owners actually work: on their feet, often with one hand, in a busy kitchen environment.

**Key Insight from Competitive Research:** Uber Eats and Deliveroo both provide TWO apps for restaurants - one for real-time orders, one for analytics. We will combine these into ONE mobile-optimized progressive web app (PWA) with native app capabilities, reducing complexity for our less tech-savvy user base.

**Critical Differentiator:** Unlike generic platforms, TurkEats is built specifically for Turkish/kebab cuisine businesses, with features like loyalty program integration, transparent commission display, and cultural/language considerations (French/Turkish).

---

## Table of Contents

1. [Target User Persona](#1-target-user-persona)
2. [User Journey: A Day in the Life](#2-user-journey-a-day-in-the-life)
3. [User Stories](#3-user-stories)
4. [Feature Requirements](#4-feature-requirements)
5. [Mobile-First Design Principles](#5-mobile-first-design-principles)
6. [TurkEats Differentiators](#6-turkeats-differentiators)
7. [Success Metrics](#7-success-metrics)
8. [Appendices](#8-appendices)

---

## 1. Target User Persona

### Primary Persona: Mehmet Yilmaz - "The Kebab Patron"

![Persona Badge: Mehmet, 52, Kebab Shop Owner, Paris Suburb]

#### Demographics
| Attribute | Value |
|-----------|-------|
| **Name** | Mehmet Yilmaz |
| **Age** | 52 years old |
| **Location** | Aubervilliers, Paris suburb (93) |
| **Business** | "Kebab Sultan" - family kebab shop, 15 years |
| **Role** | Owner-operator (also cooks, serves, manages) |
| **Staff** | Wife (cashier), son (delivery), 1 part-time cook |
| **Tech Devices** | Samsung Galaxy A53 (personal), old iPad (kitchen) |
| **Languages** | French (conversational), Turkish (native) |

#### Psychographics
| Trait | Description |
|-------|-------------|
| **Tech Comfort** | Low-medium. Uses WhatsApp, Facebook, Google Maps. No apps beyond basics. |
| **Peak Anxiety** | Friday/Saturday 7-11pm when orders pile up |
| **Trust Issues** | Burned by Uber Eats commission (30%+), suspicious of platforms |
| **Pride** | Takes immense pride in quality of his döner - it's his reputation |
| **Financial Mindset** | Watches every euro. Needs to see exactly what he earns vs. what platform takes |
| **Pain Points** | Missed orders, wrong addresses, customers not finding shop, can't see earnings clearly |

#### Day-to-Day Reality
- Wakes at 9am, prepares dough and marinates meat
- Opens shop 11am, handles lunch rush (12-2pm)
- Quiet afternoon - catches up on admin, supplies
- Dinner rush 7-11pm (70% of daily revenue)
- Closes midnight on weekends, 10pm weekdays
- Uses phone constantly but rarely sits at computer
- Wife handles cash register and sometimes takes phone orders

#### Quotes (User Research Insights)
> "Uber takes too much. I want to see exactly how much I make on each order."

> "I don't have time to learn complicated apps. It has to be simple - like WhatsApp."

> "When it's busy, I can't look at the screen. I need a loud sound."

> "My son uses the app more than me. He shows me how to do things."

#### Goals
1. **Increase revenue** without paying 30% commission
2. **Stop missing orders** - current setup is unreliable
3. **Build loyal customer base** - know who orders regularly
4. **Manage menu easily** - prices change, items sell out
5. **Get paid quickly** - cash flow is tight

#### Frustrations
1. Platforms hide the real commission breakdown
2. Can't easily mark items as sold out
3. Notifications don't work reliably
4. Analytics are confusing and in English
5. Menu editing requires computer, which he rarely uses

---

### Secondary Persona: Ayşe Yilmaz - "The Family Support"

| Attribute | Value |
|-----------|-------|
| **Name** | Ayşe Yilmaz (Mehmet's wife) |
| **Age** | 48 years old |
| **Role** | Handles cash, phone orders, customer service |
| **Tech Comfort** | Medium - uses Instagram, manages family WhatsApp groups |
| **Device** | iPhone SE (personal) |

**Ayşe's Needs:**
- Sees order history to resolve customer disputes
- Checks daily earnings when Mehmet is busy cooking
- Responds to customer reviews (she's the "people person")
- Manages loyalty rewards when regulars come in

---

### Secondary Persona: Emre Yilmaz - "The Digital Native"

| Attribute | Value |
|-----------|-------|
| **Name** | Emre Yilmaz (Mehmet's son) |
| **Age** | 24 years old |
| **Role** | Delivery driver, tech support for parents |
| **Tech Comfort** | High - grew up with smartphones |
| **Device** | iPhone 14 |

**Emre's Needs:**
- Sets up and configures the app for his parents
- Updates menu with photos
- Runs marketing campaigns/offers
- Troubleshoots issues when things break
- Manages the shop when parents are away

---

## 2. User Journey: A Day in the Life

### Mehmet's Thursday at Kebab Sultan

#### 09:30 - Morning Prep (Before Opening)
**Context:** Kitchen prep, phone in apron pocket

| Time | Action | App Touchpoint |
|------|--------|----------------|
| 09:30 | Checks yesterday's earnings while coffee brews | Opens app → Dashboard → Quick glance at €412 revenue |
| 09:45 | Notices lamb kebab sold out yesterday | Quick toggle: Mark "Lamb Döner" as available again |
| 10:00 | Sees new 1-star review from angry customer | Tap review → Write apology reply |
| 10:30 | Realizes it's a holiday next week | Settings → Schedule closure for Monday |

**App Requirements:**
- Dashboard loads in <2 seconds
- Revenue visible without scrolling
- One-tap to toggle item availability
- Review notifications with preview text

---

#### 11:00 - Opening & Lunch Rush
**Context:** Standing at grill, hands often occupied

| Time | Action | App Touchpoint |
|------|--------|----------------|
| 11:00 | Opens shop | Tap "Open for Orders" (big green button) |
| 12:15 | First order comes in | **LOUD SOUND** + vibration + notification |
| 12:16 | Glances at screen while grilling | Sees "Dürum x2, Frites" - taps ACCEPT |
| 12:20 | More orders arrive | Audio: "Nouvelle commande" spoken + sound |
| 12:25 | Hands full, calls out to wife | Wife accepts order from her phone |
| 12:35 | Order ready for pickup | Taps "READY" - driver notified |
| 13:00 | Running low on chicken | Quick toggle: "Poulet Kebab" → Sold Out |

**App Requirements:**
- **Audio alerts mandatory** - configurable volume, distinct sounds
- **Extra-large buttons** - work with greasy fingers
- **Glanceable info** - see order contents in <3 seconds
- **Multi-device support** - same account on multiple phones
- **One-tap status changes** - Accept → Preparing → Ready

---

#### 14:30 - Afternoon Lull
**Context:** Sitting in quiet shop, time to do admin

| Time | Action | App Touchpoint |
|------|--------|----------------|
| 14:30 | Checks week's performance | Analytics → This Week → €2,847 revenue |
| 14:45 | Sees Tuesday was slow | Realizes it was raining - makes sense |
| 15:00 | Customer calls about missing sauce | Order History → Find order → See details |
| 15:15 | Decides to update prices (ingredient costs up) | Menu → Döner Assiette → €11.50 → €12.00 |
| 15:30 | Takes photo of new special | Menu → Add Item → Camera → "Weekend Special" |
| 15:45 | Checks when payout arrives | Payments → Next Payout: Friday €623 |

**App Requirements:**
- Simple analytics - daily/weekly totals, not complex charts
- Order search by customer name or order number
- Inline price editing (no separate screen)
- Camera integration for item photos
- Clear payout schedule with amounts

---

#### 19:00 - Dinner Rush (Critical Period)
**Context:** Maximum stress, three people working, constant activity

| Time | Action | App Touchpoint |
|------|--------|----------------|
| 19:00 | Rush begins | Multiple orders coming - loud audio each time |
| 19:10 | 5 active orders, getting overwhelmed | Taps "Busy Mode" - adds 10 min to prep times |
| 19:30 | Runs out of pita bread | Emergency: Pause ALL orders (temporary close) |
| 19:45 | Bread restocked | Tap to resume orders |
| 20:00 | Big order: €78 group order | Audio: "GRANDE COMMANDE!" + special sound |
| 20:15 | Customer in shop uses loyalty | Scans QR → "15 points earned" confirmation |
| 21:00 | Delivery driver hasn't picked up | Sees driver location, calls via app |

**App Requirements:**
- **Busy Mode** - one tap to extend all prep times
- **Emergency Pause** - stop ALL orders immediately
- **Distinct sound for large orders** (>€50)
- **Driver tracking** - where is the pickup person?
- **Loyalty integration** - scan to award points

---

#### 22:30 - Closing Time
**Context:** Cleaning up, counting cash, reviewing day

| Time | Action | App Touchpoint |
|------|--------|----------------|
| 22:30 | Closes orders | Tap "Close for Night" |
| 22:35 | Reviews day's earnings | Dashboard → Today: €687 gross |
| 22:40 | Checks commission taken | Breakdown: €687 - €48 commission = €639 net |
| 22:45 | Sees he earned 43 loyalty points for customers | Loyalty Summary: 8 customers earned points |
| 22:50 | One bad review came in | Decides to reply tomorrow morning |
| 23:00 | Checks tomorrow's schedule | Confirms hours, no closures |

**App Requirements:**
- **Clear commission breakdown** - gross, commission %, net
- **Loyalty summary** - points distributed today
- **Daily recap** - orders, revenue, ratings
- **Next day preview** - scheduled orders, special hours

---

## 3. User Stories

### 3.1 Core Order Management

#### US-RD-001: Receive New Order Notification
```
As Mehmet (restaurant owner)
I want to receive an unmissable alert when a new order arrives
So that I never miss an order even when my hands are full

Acceptance Criteria:
- [ ] LOUD audio alert plays (configurable: 3 volume levels + custom sounds)
- [ ] Phone vibrates continuously for 15 seconds
- [ ] Push notification shows: Order number, total €, item summary
- [ ] Notification persists until acknowledged (doesn't auto-dismiss)
- [ ] Repeat alert every 60 seconds if not acknowledged
- [ ] Works when app is in background
- [ ] Works when screen is off
- [ ] Distinct sound for orders >€50 ("grande commande")
- [ ] French voice announcement option: "Nouvelle commande, quinze euros"
- [ ] Multiple devices receive same notification (family account)
```

#### US-RD-002: Accept Order with One Tap
```
As Mehmet
I want to accept an order with a single large button
So that I can confirm orders quickly during rush hour

Acceptance Criteria:
- [ ] "ACCEPTER" button is minimum 72px height (thumb-friendly)
- [ ] High contrast green (#22C55E) on dark background
- [ ] Confirmation haptic feedback
- [ ] Order moves to "En préparation" status automatically
- [ ] Customer receives instant notification: "Votre commande est confirmée"
- [ ] Prep time countdown starts (default 15 min, configurable)
- [ ] If not accepted in 5 minutes, escalation alert plays
- [ ] Auto-reject option after 10 minutes (configurable)
```

#### US-RD-003: Reject Order with Reason
```
As Mehmet
I want to reject an order with a quick reason selection
So that customers understand why and can reorder

Acceptance Criteria:
- [ ] "REFUSER" button clearly visible but secondary styling
- [ ] Quick-select reasons (no typing required):
  - "Article indisponible" (Item unavailable)
  - "Trop occupé" (Too busy)
  - "Fermé bientôt" (Closing soon)
  - "Problème de livraison" (Delivery issue)
  - "Autre" (Other - optional text)
- [ ] Customer receives notification with reason
- [ ] Order logged in history as "Refusé"
- [ ] Analytics track rejection rate and reasons
```

#### US-RD-004: Update Order Status
```
As Mehmet
I want to update order status with one tap
So that customers and drivers know exactly when food is ready

Acceptance Criteria:
- [ ] Status flow: Nouveau → Accepté → En préparation → Prêt → Récupéré
- [ ] Large status button changes based on current state
- [ ] "PRÊT" (Ready) button sends instant notification to driver
- [ ] "PRÊT" shows estimated driver arrival time
- [ ] Timer shows how long order has been in current status
- [ ] Warning color if order is taking longer than expected
- [ ] Swipe gesture alternative: swipe right to advance status
```

#### US-RD-005: View Active Orders
```
As Mehmet
I want to see all active orders at a glance
So that I can manage the kitchen workflow

Acceptance Criteria:
- [ ] Orders grouped by status in horizontal lanes/tabs
- [ ] Each order card shows: Order #, Time elapsed, Items summary, Total €
- [ ] Color coding: New (orange), Preparing (blue), Ready (green)
- [ ] Badge count on each status tab
- [ ] Pull-to-refresh updates instantly
- [ ] Auto-refresh every 30 seconds
- [ ] Offline indicator if connection lost
- [ ] Estimated completion time per order
```

#### US-RD-006: Handle Order During Busy Period
```
As Mehmet
I want to activate "Busy Mode" with one tap
So that I can manage customer expectations when overwhelmed

Acceptance Criteria:
- [ ] "MODE OCCUPÉ" button prominently visible
- [ ] One tap adds +10 minutes to all estimated delivery times
- [ ] Customers see "Restaurant très demandé" indicator
- [ ] New orders still accepted but with extended times
- [ ] Visual indicator on dashboard shows Busy Mode active
- [ ] Auto-deactivates after 30 minutes (configurable)
- [ ] Can extend Busy Mode while active
```

#### US-RD-007: Emergency Pause All Orders
```
As Mehmet
I want to immediately stop all new orders
So that I can handle emergencies (ran out of ingredients, equipment failure)

Acceptance Criteria:
- [ ] "PAUSE COMMANDES" button always accessible
- [ ] Confirmation required: "Êtes-vous sûr?"
- [ ] All new orders blocked instantly
- [ ] Existing orders remain active
- [ ] Restaurant shows as "Temporairement fermé" in app
- [ ] Resume button equally prominent
- [ ] Optional: Set auto-resume time
- [ ] Notification to any customer trying to order
```

---

### 3.2 Menu Management

#### US-RD-008: Toggle Item Availability
```
As Mehmet
I want to mark an item as sold out with one tap
So that customers don't order unavailable items

Acceptance Criteria:
- [ ] Toggle switch next to each menu item
- [ ] "ÉPUISÉ" label appears on item when toggled off
- [ ] Customer app shows item grayed out immediately
- [ ] Batch toggle option: "Marquer plusieurs comme épuisés"
- [ ] Auto-restock at start of each day (configurable)
- [ ] History of availability changes (audit trail)
```

#### US-RD-009: Edit Item Price
```
As Mehmet
I want to change an item's price quickly
So that I can respond to ingredient cost changes

Acceptance Criteria:
- [ ] Inline price editing (tap price → edit → save)
- [ ] No page navigation required
- [ ] Number pad optimized for currency (€)
- [ ] Confirmation before save
- [ ] Price history visible (last 3 changes)
- [ ] Bulk price adjustment option (e.g., +5% all items)
```

#### US-RD-010: Add New Menu Item
```
As Emre (tech-savvy son)
I want to add a new menu item with photo
So that we can promote new specials

Acceptance Criteria:
- [ ] "Ajouter un article" button on menu screen
- [ ] Form fields: Name, Description, Price, Category, Photo
- [ ] Camera integration for photo capture
- [ ] Photo cropping and brightness adjustment
- [ ] Preview before publishing
- [ ] Save as draft option (don't publish yet)
- [ ] Duplicate existing item option (for variations)
- [ ] Option modifiers: sizes, extras, sauces
```

#### US-RD-011: Manage Menu Categories
```
As Emre
I want to organize menu into categories
So that customers can browse easily

Acceptance Criteria:
- [ ] Categories list: Kebabs, Assiettes, Sandwichs, Boissons, Desserts
- [ ] Drag-and-drop to reorder categories
- [ ] Add/rename/delete categories
- [ ] Move items between categories
- [ ] Category visibility toggle (hide entire category)
- [ ] Category-specific availability schedule (e.g., desserts lunch only)
```

---

### 3.3 Analytics & Reporting

#### US-RD-012: View Daily Revenue
```
As Mehmet
I want to see today's earnings in 3 seconds
So that I know how the day is going

Acceptance Criteria:
- [ ] Revenue prominently displayed on dashboard home
- [ ] Shows: Gross revenue, Commission (€ and %), Net revenue
- [ ] Comparison to yesterday: "↑12% vs hier"
- [ ] Comparison to same day last week
- [ ] Order count and average order value
- [ ] Updates in real-time as orders complete
```

#### US-RD-013: View Weekly/Monthly Performance
```
As Mehmet
I want to see longer-term trends
So that I can understand my business patterns

Acceptance Criteria:
- [ ] Toggle: Aujourd'hui | Cette semaine | Ce mois | Personnalisé
- [ ] Simple bar chart showing daily revenue
- [ ] Total revenue, order count, avg order value
- [ ] Best day and worst day highlighted
- [ ] Comparison to previous period
- [ ] Peak hours analysis (busiest times)
- [ ] No complex charts - simple, clear numbers
```

#### US-RD-014: View Popular Items
```
As Mehmet
I want to know which items sell best
So that I can stock ingredients appropriately

Acceptance Criteria:
- [ ] Top 10 items by quantity sold
- [ ] Top 10 items by revenue
- [ ] Time period filter (day/week/month)
- [ ] Items with declining sales flagged
- [ ] New items performance tracking
```

---

### 3.4 Payments & Earnings

#### US-RD-015: View Earnings Breakdown
```
As Mehmet
I want to see exactly how much TurkEats takes from each order
So that I trust the platform and understand my margins

Acceptance Criteria:
- [ ] Per-order breakdown: Subtotal, Delivery fee (customer paid), Commission (%), Net to restaurant
- [ ] Daily summary: Gross sales, Total commission, Total delivery fees, Net earnings
- [ ] Commission percentage clearly stated (e.g., "15% commission TurkEats")
- [ ] Comparison to competitor rates shown ("Uber: 30%, TurkEats: 15%")
- [ ] Running total of savings vs Uber Eats
- [ ] No hidden fees - every euro accounted for
```

#### US-RD-016: View Payout Schedule
```
As Mehmet
I want to know exactly when I'll receive my money
So that I can manage cash flow

Acceptance Criteria:
- [ ] Next payout date clearly shown
- [ ] Pending balance (not yet paid out)
- [ ] Available balance (ready to withdraw)
- [ ] Payout history with dates and amounts
- [ ] Bank account last 4 digits shown
- [ ] Edit bank account option (verified via OTP)
- [ ] Payout frequency options: Weekly, Daily
```

#### US-RD-017: Download Financial Reports
```
As Ayşe (handles accounting)
I want to download monthly statements
So that I can do bookkeeping and taxes

Acceptance Criteria:
- [ ] PDF download: Monthly statement
- [ ] CSV export: All transactions
- [ ] Report includes: Date, Order #, Gross, Commission, Net, Payment status
- [ ] Email statement option
- [ ] VAT-compliant format for French tax requirements
```

---

### 3.5 Customer Relations

#### US-RD-018: View and Reply to Reviews
```
As Ayşe
I want to read and respond to customer reviews
So that we can maintain our reputation

Acceptance Criteria:
- [ ] New review notification (not as loud as orders)
- [ ] Review shows: Star rating, Written review, Order details, Customer name
- [ ] Reply box with character limit (500 chars)
- [ ] Pre-written reply templates for common situations
- [ ] Public/private reply option
- [ ] Flag inappropriate review option
- [ ] Average rating trend over time
```

#### US-RD-019: View Loyal Customers
```
As Mehmet
I want to see which customers order frequently
So that I can recognize and reward them

Acceptance Criteria:
- [ ] Top 10 customers by order frequency
- [ ] Top 10 customers by total spend
- [ ] Customer detail: Name, Total orders, Total spent, Last order date, Loyalty points
- [ ] Mark as "VIP" option (gets priority handling)
- [ ] Send personalized message to loyal customer
- [ ] See loyalty points balance per customer
```

---

### 3.6 Loyalty Program (TurkEats Unique)

#### US-RD-020: View Loyalty Dashboard
```
As Mehmet
I want to see how the loyalty program is performing for my shop
So that I understand customer retention

Acceptance Criteria:
- [ ] Points distributed today/this week/this month
- [ ] Points redeemed against my shop
- [ ] Number of customers with active points
- [ ] Conversion rate: visitors → loyalty members
- [ ] Cost of redeemed rewards (subsidized by TurkEats)
```

#### US-RD-021: Scan Customer Loyalty QR
```
As Ayşe
I want to scan a customer's QR code for in-store loyalty
So that walk-in customers can earn points too

Acceptance Criteria:
- [ ] "Scanner fidélité" button on home screen
- [ ] Camera opens instantly
- [ ] Scans customer's TurkEats app QR
- [ ] Shows: Customer name, Current points balance
- [ ] Input purchase amount → Calculate points earned
- [ ] Confirmation: "Marie a gagné 12 points!"
- [ ] Works offline (syncs when connection returns)
```

---

### 3.7 Settings & Configuration

#### US-RD-022: Configure Operating Hours
```
As Mehmet
I want to set my opening hours
So that customers know when we're available

Acceptance Criteria:
- [ ] Hours for each day of week
- [ ] Different hours for different days
- [ ] "Fermé" toggle for specific days
- [ ] Holiday closure scheduling
- [ ] Last-minute closure (with reason)
- [ ] Special hours (e.g., Ramadan schedule)
```

#### US-RD-023: Configure Notification Preferences
```
As Mehmet
I want to customize how I receive alerts
So that they work for my environment

Acceptance Criteria:
- [ ] Sound selection (5+ options, preview before selecting)
- [ ] Volume level (Low / Medium / High / Maximum)
- [ ] Voice announcements toggle (French/Turkish)
- [ ] Vibration pattern selection
- [ ] Do Not Disturb schedule (e.g., 1am-9am)
- [ ] Alert for specific order types only (optional)
```

#### US-RD-024: Manage Team Access
```
As Mehmet
I want to give my wife and son access to the app
So that we can all manage orders

Acceptance Criteria:
- [ ] Invite team member via phone number or email
- [ ] Roles: Propriétaire (Owner), Gérant (Manager), Staff
- [ ] Permissions per role:
  - Owner: Full access
  - Manager: All except payouts and team management
  - Staff: Orders and menu availability only
- [ ] Remove team member access
- [ ] See activity log per team member
```

---

### 3.8 Store Settings

#### US-RD-025: Configure Delivery Settings
```
As Mehmet
I want to set my delivery radius and minimum order
So that I only accept viable deliveries

Acceptance Criteria:
- [ ] Delivery radius: Slider or input (1-10 km)
- [ ] Minimum order amount (€)
- [ ] Delivery fee (passed to customer)
- [ ] Free delivery threshold (e.g., free over €25)
- [ ] Estimated delivery time range (e.g., 25-40 min)
- [ ] Max concurrent orders limit (optional)
```

#### US-RD-026: Update Restaurant Profile
```
As Emre
I want to update our restaurant's public information
So that customers have accurate details

Acceptance Criteria:
- [ ] Restaurant name
- [ ] Address (with map preview)
- [ ] Phone number
- [ ] Logo upload
- [ ] Cover photo upload
- [ ] Short description (150 chars)
- [ ] Cuisine tags: Turc, Kebab, Halal, etc.
- [ ] Preview how profile looks in customer app
```

---

## 4. Feature Requirements

### 4.1 MVP Features (Phase 1)

| Priority | Feature | User Stories |
|----------|---------|--------------|
| P0 | Order Notifications | US-RD-001, US-RD-002, US-RD-003 |
| P0 | Order Status Management | US-RD-004, US-RD-005 |
| P0 | Emergency Controls | US-RD-006, US-RD-007 |
| P0 | Menu Availability Toggle | US-RD-008 |
| P0 | Daily Revenue View | US-RD-012 |
| P0 | Earnings Breakdown | US-RD-015 |
| P0 | Operating Hours | US-RD-022 |
| P1 | Menu Price Editing | US-RD-009 |
| P1 | Payout Schedule | US-RD-016 |
| P1 | Review Management | US-RD-018 |
| P1 | Notification Settings | US-RD-023 |

### 4.2 Phase 2 Features

| Priority | Feature | User Stories |
|----------|---------|--------------|
| P1 | Menu Item Creation | US-RD-010, US-RD-011 |
| P1 | Weekly/Monthly Analytics | US-RD-013, US-RD-014 |
| P1 | Financial Reports | US-RD-017 |
| P1 | Team Access | US-RD-024 |
| P2 | Loyal Customer View | US-RD-019 |
| P2 | Loyalty Dashboard | US-RD-020, US-RD-021 |
| P2 | Delivery Settings | US-RD-025 |
| P2 | Profile Management | US-RD-026 |

---

## 5. Mobile-First Design Principles

### 5.1 Physical Context
| Constraint | Design Response |
|------------|-----------------|
| Greasy/wet hands | Large touch targets (min 56px), no precise gestures |
| Kitchen noise | Audio alerts at 90dB+, visual alerts with animation |
| Poor lighting | High contrast mode, no thin fonts |
| One-handed use | Bottom navigation, thumb-reachable actions |
| Constant movement | No mandatory typing, voice input option |
| Phone in pocket | Persistent notifications, vibration patterns |

### 5.2 Technical Requirements
| Requirement | Implementation |
|-------------|----------------|
| Offline support | Service Worker, queue actions when offline |
| Fast load | <2s first paint, <4s interactive |
| Low data usage | <1MB per session |
| Battery efficient | No background polling when store closed |
| PWA installable | Add to home screen with native feel |
| Push notifications | FCM/APNS with high priority |

### 5.3 Accessibility
| Requirement | Implementation |
|-------------|----------------|
| Large text option | 18px base, scalable to 24px |
| Voice control | "Accepter commande" voice commands |
| Screen reader | Full ARIA labels in French |
| Color blind safe | Never rely on color alone |

---

## 6. TurkEats Differentiators

### 6.1 Transparent Commission
Unlike Uber Eats (30%) and Deliveroo (25-35%):
- **15% commission** clearly shown
- Per-order breakdown visible
- Running savings tracker: "Vous avez économisé €847 vs Uber Eats"

### 6.2 Loyalty Integration
- See customer points balance
- Award in-store loyalty points via QR scan
- Identify top loyal customers
- Track redemptions at your restaurant

### 6.3 Cultural Adaptation
- **Language**: Full French interface, Turkish option
- **Cuisine-specific**: Kebab portion sizes, döner cut options
- **Halal compliance**: Halal certification display
- **Cultural features**: Ramadan schedule, holiday hours

### 6.4 Family Business Features
- Multi-user access (owner, spouse, children)
- Role-based permissions
- Activity audit trail
- Shared notifications across devices

---

## 7. Success Metrics

### 7.1 Restaurant Adoption
| Metric | Target |
|--------|--------|
| Activation rate | >80% complete onboarding |
| Daily active rate | >60% of restaurants log in daily |
| Order acceptance rate | >95% orders accepted |
| Avg time to accept order | <2 minutes |

### 7.2 Operational Efficiency
| Metric | Target |
|--------|--------|
| Missed orders | <1% |
| Menu update frequency | >2 updates/week |
| Review response rate | >50% |

### 7.3 Satisfaction
| Metric | Target |
|--------|--------|
| App store rating | >4.5 stars |
| NPS (restaurant owners) | >50 |
| Support tickets | <5 per 100 restaurants/month |

---

## 8. Appendices

### 8.1 Competitive Reference
See: [COMPETITIVE-RESEARCH-MERCHANT-DASHBOARDS.md](../00-intake/COMPETITIVE-RESEARCH-MERCHANT-DASHBOARDS.md)

### 8.2 Information Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      BOTTOM NAV (5 items)                   │
├─────────────┬─────────────┬─────────────┬─────────────┬─────┤
│  Commandes  │    Menu     │   Stats     │  Paiements  │ Plus│
│   (Orders)  │   (Menu)    │ (Analytics) │ (Payments)  │(More)│
└─────────────┴─────────────┴─────────────┴─────────────┴─────┘

Commandes (Home/Default):
├── Nouvelles (New orders - with count badge)
├── En cours (In progress)
├── Prêtes (Ready for pickup)
└── Historique (Order history)

Menu:
├── Articles (Items with availability toggles)
├── Catégories (Categories)
└── + Ajouter article (Add item)

Stats:
├── Aujourd'hui (Today's summary)
├── Cette semaine (This week)
├── Articles populaires (Popular items)
└── Avis clients (Customer reviews)

Paiements:
├── Solde actuel (Current balance)
├── Prochain virement (Next payout)
├── Historique (Payout history)
└── Rapports (Reports)

Plus:
├── Horaires (Operating hours)
├── Paramètres (Notifications, sounds)
├── Mon équipe (Team management)
├── Mon restaurant (Profile)
├── Fidélité (Loyalty dashboard)
├── Aide (Help/Support)
└── Déconnexion (Logout)
```

### 8.3 Key Screens (Wireframe Descriptions)

**Screen 1: Orders Home**
- Top: Store status toggle (Open/Closed)
- Middle: Order cards in horizontal scrollable lanes
- Bottom: Fixed nav bar
- FAB: Scan loyalty QR

**Screen 2: Order Detail**
- Order number and time elapsed (prominent)
- Customer name (first name only for privacy)
- Item list with quantities and special instructions
- Delivery address with map preview
- Large action buttons: ACCEPTER / REFUSER

**Screen 3: Menu Management**
- Category tabs at top
- Items list with toggle switches
- Inline price display (tap to edit)
- + Add button fixed at bottom

**Screen 4: Daily Dashboard**
- Big number: Today's revenue
- Smaller: Commission, Net, Order count
- Chart: Hourly orders (simple bar)
- List: Recent orders

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Chi CTO | Initial draft - competitive research + user stories |

---

*TurkEats Restaurateur Dashboard PRD | PAI v2 | 2026-01-19*
