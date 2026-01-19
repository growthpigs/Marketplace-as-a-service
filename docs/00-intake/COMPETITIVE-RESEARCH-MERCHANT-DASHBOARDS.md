# Competitive Research: Food Delivery Merchant Dashboards

**Project:** TurkEats Restaurateur Dashboard
**Date:** 2026-01-19
**Purpose:** Inform PRD and user stories for mobile-first restaurant management app

---

## Executive Summary

This research analyzes merchant/restaurant dashboards from Uber Eats and Deliveroo - the two dominant food delivery platforms. Key finding: **Both platforms provide TWO separate apps for restaurants**:

1. **Order Management App** - Real-time order acceptance, prep tracking, rider coordination
2. **Business Management App** - Analytics, menu editing, payouts, marketing

TurkEats should consider whether to combine these or follow the same pattern.

---

## 1. Uber Eats Merchant Ecosystem

### 1.1 Uber Eats Orders App (Order Management)
**Platform:** Tablet-first (iOS/Android), Web fallback
**Purpose:** Real-time order operations

| Feature | Description |
|---------|-------------|
| **Order Acceptance** | Accept incoming & scheduled orders |
| **Prep Time Management** | Alert riders when orders ready |
| **Delivery Tracking** | See assigned rider, contact info, arrival time |
| **Order Modifications** | Pause, delay, cancel orders |
| **Stock Management** | Mark items out of stock |
| **Menu Quick Edits** | Update prices, availability |
| **Store Hours** | Adjust regular & holiday hours |

**Key UX Patterns:**
- Loud audio alerts for new orders
- Large touch targets (tablet optimization)
- Color-coded order status (new/preparing/ready/picked up)
- One-tap "Ready for Pickup" button

### 1.2 Uber Eats Manager App (Business Intelligence)
**Platform:** Mobile-first (iOS/Android), Web dashboard
**Purpose:** Business analytics & optimization

| Feature | Description |
|---------|-------------|
| **Real-Time Sales** | Live sales tracker, refreshes every 30 seconds |
| **Multi-Location View** | Monitor all stores at a glance |
| **Performance Data** | Net sales, avg order size, popular times |
| **Customer Insights** | Ordering behavior, trends, retention |
| **Menu Editing** | Full CRUD: names, prices, descriptions, availability |
| **Payouts** | Current balance, payment history, earnings breakdown |
| **Order-Level Payouts** | See net payout per order |
| **Chargeback Disputes** | Dispute directly from app |
| **Marketing Campaigns** | Set up & monitor ads/offers |
| **Push Notifications** | Store status, connectivity, cancellations, inaccuracies |
| **Reports** | Payment details, order errors, downtime, feedback |

**Key UX Patterns:**
- Dashboard cards with KPIs
- Pull-to-refresh
- Date range selectors
- Location switcher (multi-store)
- Alert badges for issues needing attention

### 1.3 Uber Analytics Metrics

| Metric | Purpose |
|--------|---------|
| Order Acceptance Rate | % of orders accepted vs declined |
| Food Preparation Time | Avg minutes from accept to ready |
| Menu Availability | % of items available |
| Customer Satisfaction | Ratings & feedback |
| Downtime | Hours offline vs online |
| Missed Orders | Orders not accepted in time |
| Inaccurate Orders | Orders with errors reported |

---

## 2. Deliveroo Partner Hub

### 2.1 Platform Overview
**Primary:** Web dashboard (restaurant-hub.deliveroo.net)
**Secondary:** Partner Hub mobile app
**Note:** Deliveroo explicitly states mobile phones NOT recommended for order management (risk of missing orders)

### 2.2 Core Features

| Feature | Description |
|---------|-------------|
| **Live Orders** | Real-time order status, stock levels |
| **Sales Tracking** | Daily sales records, date filtering |
| **Menu Manager** | Add/edit/remove items, categories, modifiers |
| **Item Images** | Upload product photos |
| **Hero Photos** | Banner images for restaurant profile |
| **Stock Levels** | Mark items "in stock", "sold out today", "off menu" |
| **Marketer Tool** | Free promotional tool for offers/ads |
| **Invoices** | View & download payment statements |
| **Customer Reviews** | Reply to feedback |

### 2.3 Operational Tools

| Tool | Description |
|------|-------------|
| **Need-More-Time** | Request extra prep time when busy |
| **Busy Mode** | System-wide alert for high volume |
| **Order Ready Button** | Signal rider to collect |
| **Rider Check-In** | Know when rider arrives |
| **Prep-Time Model** | AI-predicted rider arrival timing |

### 2.4 Mobile App Notifications

| Alert Type | Timing |
|------------|--------|
| New Customer Reviews | Daily digest |
| Order Disruption | Real-time (multiple cancellations/rejections) |
| First Order Cancelled | Real-time |

---

## 3. Common Patterns Across Platforms

### 3.1 Information Architecture

Both platforms organize around:

```
├── Dashboard (Home)
│   ├── Today's Sales Summary
│   ├── Active Orders Count
│   ├── Alerts/Issues
│   └── Quick Actions
├── Orders
│   ├── Live Orders
│   ├── Order History
│   └── Scheduled Orders
├── Menu
│   ├── Items
│   ├── Categories
│   ├── Modifiers
│   └── Availability
├── Analytics/Insights
│   ├── Sales Reports
│   ├── Popular Items
│   ├── Customer Feedback
│   └── Performance Metrics
├── Payments
│   ├── Balance
│   ├── Payout History
│   └── Invoices
└── Settings
    ├── Store Hours
    ├── Contact Info
    ├── Notifications
    └── Team Access
```

### 3.2 Mobile-First Design Patterns

| Pattern | Implementation |
|---------|----------------|
| **Bottom Navigation** | 4-5 primary tabs max |
| **Card-Based Layout** | Scannable info chunks |
| **Pull-to-Refresh** | Update live data |
| **Swipe Actions** | Quick order status changes |
| **Large Touch Targets** | 48px+ tap areas |
| **High Contrast** | Readable in kitchen lighting |
| **Audio Alerts** | Critical notifications |
| **Badge Counts** | Unread/pending items |

### 3.3 Color Coding Standards

| Status | Color |
|--------|-------|
| New Order | Orange/Yellow (attention) |
| Preparing | Blue (in progress) |
| Ready | Green (complete) |
| Picked Up | Gray (done) |
| Issue/Alert | Red (urgent) |
| Paused | Purple/Gray (inactive) |

---

## 4. Gaps & TurkEats Opportunities

### 4.1 What Competitors DON'T Do (Our Differentiators)

| Gap | TurkEats Opportunity |
|-----|---------------------|
| No loyalty program integration | **Fidelity Dashboard**: See customer points, redemptions, top loyal customers |
| Generic for all cuisines | **Kebab-Specific**: Meat prep tracking, doner portions, sauce inventory |
| No cash handling | **Cash Mode**: Track cash orders, end-of-day reconciliation |
| Commission opacity | **Transparent Earnings**: Show gross vs commission vs net per order |
| No cultural adaptation | **French/Turkish Language**: Full localization |
| No family business features | **Multi-User Roles**: Owner, Manager, Kitchen Staff permissions |

### 4.2 Features We MUST Have (Table Stakes)

- [ ] Real-time order notifications (audio + visual)
- [ ] One-tap order acceptance
- [ ] Prep time estimation
- [ ] Item availability toggle
- [ ] Daily sales summary
- [ ] Order history search
- [ ] Payout tracking
- [ ] Menu editing (items, prices, photos)
- [ ] Customer review responses
- [ ] Store open/close toggle

### 4.3 Nice-to-Have (Phase 2)

- [ ] Marketing campaign builder
- [ ] Multi-location management
- [ ] Staff performance tracking
- [ ] Inventory management
- [ ] Predictive analytics (busy periods)
- [ ] Integration with POS systems

---

## 5. Mobile-First Considerations for Turkish Kebab Shops

### 5.1 User Context

| Factor | Implication |
|--------|-------------|
| **Small screen usage** | Most owners use phone, not tablet |
| **Kitchen environment** | Greasy hands, loud noise, poor lighting |
| **Limited tech comfort** | Many owners 40-60yo, not digital natives |
| **Rush hour pressure** | Friday/Saturday nights 7-11pm critical |
| **Multi-tasking** | Owner also cooking, serving, managing |
| **Family operation** | Multiple family members may use same device |

### 5.2 Design Requirements

| Requirement | Rationale |
|-------------|-----------|
| **Extra-large buttons** | Usable with greasy/wet hands |
| **High contrast mode** | Visible in bright kitchen lights |
| **Simple language** | Avoid jargon, use "Nouvelle commande" not "Incoming order request" |
| **Audio-first alerts** | Can't always look at screen |
| **Offline support** | WiFi can be unreliable |
| **One-handed operation** | Other hand often busy |
| **Quick actions** | Max 2 taps for common tasks |

---

## 6. Sources

### Uber Eats
- [Uber Eats Manager App Features (June 2025)](https://merchants.ubereats.com/us/en/resources/articles/product-highlights/uber-eats-manager-updates-june-2025/)
- [Uber Eats Manager - App Store](https://apps.apple.com/us/app/uber-eats-manager/id1513643071)
- [Uber Eats Manager - Google Play](https://play.google.com/store/apps/details?id=com.uber.restaurantmanager&hl=en_US)
- [Uber Eats Orders App Overview](https://merchants.ubereats.com/us/en/technology/manage-orders/uber-eats-orders-app/)
- [Uber Blog: Engineering Restaurant Manager](https://www.uber.com/blog/restaurant-manager/)
- [Uber Eats Manager FAQs](https://help.uber.com/merchants-and-restaurants/article/uber-eats-manager-faqs?nodeId=cc435128-5551-47b9-a935-646ef20590a0)

### Deliveroo
- [Deliveroo Partner Hub](https://restaurant-hub.deliveroo.net/)
- [Deliveroo Operations Management](https://merchants.deliveroo.com/why-deliveroo/operations)
- [Deliveroo Menu Management Guide](https://help.deliveroo.com/en/articles/3524899-managing-your-deliveroo-menu-in-partner-hub)
- [Deliveroo Partner Hub Mobile App](https://help.deliveroo.com/en/articles/9513839-managing-your-business-on-the-go-with-the-partner-hub-app)
- [Everything About Partner Hub](https://merchants.deliveroo.com/learning-centre/everything-you-need-to-know-about-partner-hub)

### UX Research
- [Mobbin Dashboard Designs](https://mobbin.com/explore/mobile/screens/dashboard)
- [Mobbin Food & Drink Apps](https://mobbin.com/explore/mobile/app-categories/food-drink)
- [Medium: UX Case Study Food Delivery App](https://medium.com/@jaiikumar/ux-case-study-designing-a-food-delivery-app-4b0d3edc417f)

---

## 7. Next Steps

1. **Mobbin Deep Dive**: Screenshot merchant-specific interfaces (pending manual research)
2. **Persona Development**: Define "Mehmet the Kebab Shop Owner"
3. **User Journey Mapping**: Day-in-the-life from morning prep to closing
4. **PRD Creation**: Mobile-first restaurateur dashboard specification
5. **User Story Writing**: Comprehensive stories (2000+ words target)

---

*Research compiled by Chi CTO | PAI v2 | 2026-01-19*
