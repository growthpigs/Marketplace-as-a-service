# TurkEats - API Contracts

**Project:** TurkEats (Marketplace-as-a-Service)
**Created:** 2026-01-12
**Status:** Draft
**Base URL:** `https://api.turkeats.fr/v1`

---

## Authentication

### POST /auth/register

Register new user.

**Request:**
```json
{
  "email": "user@example.com",
  "phone": "+33612345678",
  "password": "securepass123",
  "name": "Jean Dupont",
  "referral_code": "ABC123" // optional
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jean Dupont",
    "referral_code": "XYZ789"
  },
  "tokens": {
    "access_token": "jwt...",
    "refresh_token": "jwt...",
    "expires_in": 3600
  }
}
```

### POST /auth/login

```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

---

## Restaurants

### GET /restaurants

List restaurants near location.

**Query Params:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius`: Radius in km (default: 5)
- `category`: Filter by category
- `sort`: `distance` | `rating` | `delivery_time`
- `page`, `limit`: Pagination

**Response:**
```json
{
  "restaurants": [
    {
      "id": "uuid",
      "name": "Kebab Palace",
      "description": "...",
      "category": "assiette_grec",
      "logo_url": "...",
      "rating": 4.5,
      "review_count": 127,
      "distance_km": 1.2,
      "delivery_time_minutes": 25,
      "minimum_order": 10.00,
      "delivery_fee": 2.50,
      "is_open": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

### GET /restaurants/:id

Get restaurant details with menu.

**Response:**
```json
{
  "id": "uuid",
  "name": "Kebab Palace",
  "description": "...",
  "address": "123 Rue Example, Paris",
  "phone": "+33123456789",
  "rating": 4.5,
  "opening_hours": {
    "monday": { "open": "11:00", "close": "23:00" },
    // ...
  },
  "menu": [
    {
      "category": "Assiettes",
      "items": [
        {
          "id": "uuid",
          "name": "Assiette Grec",
          "description": "...",
          "price": 12.50,
          "image_url": "...",
          "options": [
            {
              "name": "Sauce",
              "required": true,
              "choices": [
                { "name": "Blanche", "price": 0 },
                { "name": "Harissa", "price": 0.50 }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## Orders

### POST /orders

Create order.

**Request:**
```json
{
  "restaurant_id": "uuid",
  "delivery_type": "delivery",
  "delivery_address": "456 Rue Client, Paris",
  "delivery_latitude": 48.8566,
  "delivery_longitude": 2.3522,
  "items": [
    {
      "menu_item_id": "uuid",
      "quantity": 2,
      "options_selected": [
        { "name": "Sauce", "choice": "Harissa", "price": 0.50 }
      ],
      "special_instructions": "Extra crispy"
    }
  ],
  "customer_notes": "Ring doorbell twice",
  "wallet_amount_to_apply": 5.00,
  "tip": 2.00
}
```

**Response (201):**
```json
{
  "order": {
    "id": "uuid",
    "order_number": "TK-20260112-001",
    "status": "pending",
    "subtotal": 25.00,
    "delivery_fee": 2.50,
    "service_fee": 0.55,
    "tip": 2.00,
    "wallet_applied": 5.00,
    "total": 25.05,
    "cashback_earned": 2.50,
    "estimated_delivery_at": "2026-01-12T19:30:00Z"
  },
  "payment": {
    "client_secret": "pi_xxx_secret_xxx",
    "amount": 2505 // cents
  }
}
```

### GET /orders/:id

Get order details.

### GET /orders

List user's orders.

**Query Params:**
- `status`: Filter by status
- `page`, `limit`: Pagination

---

## Group Orders

### POST /group-orders

Create group order.

**Request:**
```json
{
  "restaurant_id": "uuid",
  "delivery_address": "789 Rue Group, Paris"
}
```

**Response:**
```json
{
  "group_order": {
    "id": "uuid",
    "share_code": "GRPABC",
    "share_url": "https://turkeats.fr/group/GRPABC",
    "qr_code_url": "https://api.turkeats.fr/qr/GRPABC",
    "status": "open",
    "expires_at": "2026-01-12T20:00:00Z"
  }
}
```

### POST /group-orders/:code/join

Join a group order.

### POST /group-orders/:code/items

Add items to group order.

### POST /group-orders/:id/checkout

Lock group order and initiate payment.

---

## Wallet

### GET /wallet

Get wallet balance and transactions.

**Response:**
```json
{
  "balance": 15.50,
  "total_earned": 125.00,
  "total_withdrawn": 50.00,
  "transactions": [
    {
      "id": "uuid",
      "type": "cashback",
      "amount": 2.50,
      "description": "Cashback from order TK-20260112-001",
      "created_at": "2026-01-12T18:30:00Z"
    }
  ]
}
```

### POST /wallet/withdraw

Request withdrawal.

**Request:**
```json
{
  "amount": 50.00,
  "bank_name": "BNP Paribas",
  "iban": "FR7630006000011234567890189"
}
```

---

## Referrals

### GET /referrals

Get referral stats.

**Response:**
```json
{
  "referral_code": "XYZ789",
  "referral_url": "https://turkeats.fr/r/XYZ789",
  "qr_code_url": "https://api.turkeats.fr/qr/ref/XYZ789",
  "commission_type": "lifetime",
  "lifetime_percentage": 2,
  "stats": {
    "total_referred": 12,
    "active_users": 8,
    "total_earned": 45.00,
    "this_month_earned": 12.50
  },
  "referrals": [
    {
      "name": "Marie D.",
      "orders": 15,
      "earned": 8.50,
      "joined_at": "2026-01-05"
    }
  ]
}
```

### PUT /referrals/commission-type

Change commission preference.

**Request:**
```json
{
  "commission_type": "one_time" // or "lifetime"
}
```

---

## Restaurant Dashboard APIs

### GET /restaurant/orders

List incoming orders.

### PUT /restaurant/orders/:id/status

Update order status.

**Request:**
```json
{
  "status": "preparing", // or "ready", "delivering", "delivered"
  "estimated_ready_at": "2026-01-12T19:15:00Z"
}
```

### GET /restaurant/menu

### PUT /restaurant/menu/items/:id

### POST /restaurant/menu/items

---

## WebSocket Events

Connect to: `wss://api.turkeats.fr/ws`

### Order Events

```json
// Restaurant receives new order
{
  "event": "order:new",
  "data": { "order_id": "uuid", "order_number": "TK-..." }
}

// Customer receives status update
{
  "event": "order:status",
  "data": {
    "order_id": "uuid",
    "status": "preparing",
    "estimated_delivery_at": "2026-01-12T19:30:00Z"
  }
}

// Driver location update
{
  "event": "driver:location",
  "data": {
    "order_id": "uuid",
    "latitude": 48.8566,
    "longitude": 2.3522
  }
}
```

---

## Error Responses

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "constraint": "Must be a valid email"
    }
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` - 400
- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403
- `NOT_FOUND` - 404
- `CONFLICT` - 409
- `RATE_LIMITED` - 429
- `SERVER_ERROR` - 500

---

## Related Documents

- [DATA-MODEL.md](DATA-MODEL.md) - Database schema
- [TECH-STACK.md](TECH-STACK.md) - Technology choices
- [../01-product/MVP-PRD.md](../01-product/MVP-PRD.md) - Requirements
