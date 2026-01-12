# F002 - Restaurant Discovery

**ID:** F002
**Priority:** P0 (MVP)
**Status:** Spec Complete
**Estimate:** 4 DU

---

## Overview

Allow customers to discover Turkish restaurants near them. Location-based search with filters for cuisine type, rating, delivery time, and minimum order.

---

## User Stories

### US-005: Location Detection
```
As a customer
I want the app to detect my location
So I can see nearby restaurants

Acceptance Criteria:
- [ ] Request location permission on first use
- [ ] Show current address
- [ ] Allow manual address entry
- [ ] Save multiple addresses (home, work)
```

### US-006: Restaurant List
```
As a customer
I want to browse restaurants near me
So I can choose where to order

Acceptance Criteria:
- [ ] Show restaurants within 5km radius (configurable)
- [ ] Display: name, image, rating, delivery time, minimum order
- [ ] Show "Open" / "Closed" status
- [ ] Indicate if restaurant is "New" (<30 days)
- [ ] Pull-to-refresh
```

### US-007: Search & Filter
```
As a customer
I want to search and filter restaurants
So I can find exactly what I want

Acceptance Criteria:
- [ ] Text search by restaurant name
- [ ] Filter by category (Assiette, Sandwich, Soup, Grill, etc.)
- [ ] Filter by rating (4+, 4.5+)
- [ ] Filter by delivery time (<30min, <45min)
- [ ] Sort: Distance, Rating, Delivery Time, Popularity
```

### US-008: Restaurant Preview
```
As a customer
I want to see restaurant details before opening
So I can decide if I want to order

Acceptance Criteria:
- [ ] Full-screen restaurant header image
- [ ] Opening hours
- [ ] Delivery fee and minimum order
- [ ] Customer reviews summary
- [ ] "View Menu" CTA
```

---

## Technical Specification

### Stack
- **Maps:** google_maps_flutter
- **Geocoding:** Google Geocoding API
- **Search:** Supabase full-text search (pg_trgm)

### API Endpoints

```typescript
// GET /restaurants?lat=48.8566&lng=2.3522&radius=5000
Response: {
  restaurants: [{
    id: "uuid",
    name: "Kebab Palace",
    slug: "kebab-palace",
    image_url: "https://...",
    rating: 4.5,
    review_count: 128,
    delivery_time_min: 25,
    delivery_time_max: 35,
    delivery_fee: 2.50,
    minimum_order: 10.00,
    distance_km: 1.2,
    categories: ["kebab", "grill"],
    is_open: true,
    is_new: false
  }],
  total: 24
}

// GET /restaurants/:id
Response: {
  ...restaurant,
  address: "123 Rue de Paris",
  phone: "+33...",
  opening_hours: {
    monday: { open: "11:00", close: "22:00" },
    ...
  },
  photos: ["url1", "url2"],
  top_reviews: [...]
}

// GET /restaurants/search?q=kebab&category=grill
Response: { restaurants: [...] }
```

### Database Schema

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),

  -- Delivery settings
  delivery_radius_km DECIMAL(4,1) DEFAULT 5.0,
  delivery_fee DECIMAL(5,2) DEFAULT 0,
  minimum_order DECIMAL(6,2) DEFAULT 0,
  delivery_time_min INT DEFAULT 30,
  delivery_time_max INT DEFAULT 45,

  -- Platform settings
  commission_rate DECIMAL(4,2) DEFAULT 5.00,
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, suspended

  -- Computed
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for location queries
CREATE INDEX idx_restaurants_location ON restaurants USING GIST(location);

-- Full-text search
CREATE INDEX idx_restaurants_name_search ON restaurants USING GIN(to_tsvector('french', name));

CREATE TABLE restaurant_categories (
  restaurant_id UUID REFERENCES restaurants(id),
  category VARCHAR(50),
  PRIMARY KEY (restaurant_id, category)
);

CREATE TABLE restaurant_hours (
  restaurant_id UUID REFERENCES restaurants(id),
  day_of_week INT, -- 0=Sunday, 6=Saturday
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT false,
  PRIMARY KEY (restaurant_id, day_of_week)
);
```

### Flutter Implementation

```dart
// lib/features/discovery/providers/restaurants_provider.dart
@riverpod
Future<List<Restaurant>> nearbyRestaurants(
  NearbyRestaurantsRef ref, {
  required double lat,
  required double lng,
  double radius = 5000,
  String? category,
  String? sortBy,
}) async {
  final query = supabase
    .from('restaurants')
    .select()
    .eq('status', 'active')
    .lte('delivery_radius_km', radius / 1000);

  // PostGIS distance calculation via RPC
  final response = await supabase.rpc('get_nearby_restaurants', params: {
    'user_lat': lat,
    'user_lng': lng,
    'max_distance': radius,
  });

  return response.map((r) => Restaurant.fromJson(r)).toList();
}
```

---

## UI Screens

1. **Home Screen** - Address bar + restaurant grid/list
2. **Map View** - Restaurant pins on map (toggle view)
3. **Filter Sheet** - Bottom sheet with filter options
4. **Restaurant Detail** - Full restaurant info before menu

---

## Dependencies

- F001 (Auth) - User must be logged in
- Google Maps API key configured
- Restaurants seeded in database

---

## Edge Cases

- No restaurants in radius → Show "No restaurants found" + expand radius option
- Restaurant closed → Show dimmed with "Opens at X" label
- Location permission denied → Manual address entry required
- Poor GPS accuracy → Show accuracy indicator

---

## Testing Checklist

- [ ] Location permission flow
- [ ] Restaurant list loads correctly
- [ ] Distance calculation accuracy
- [ ] Filter combinations work
- [ ] Sort options work
- [ ] Search returns relevant results
- [ ] Closed restaurants shown correctly
- [ ] Pull-to-refresh updates list
