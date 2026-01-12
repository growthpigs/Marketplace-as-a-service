-- TurkEats Seed Data
-- Run after initial migration to populate test data

-- =====================================================
-- TEST RESTAURANTS
-- =====================================================

INSERT INTO restaurants (id, name, slug, description, image_url, address, location, phone, delivery_fee, minimum_order, delivery_time_min, delivery_time_max, status, rating, review_count)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Kebab Palace',
    'kebab-palace',
    'Les meilleurs kebabs de Paris depuis 2010',
    'https://images.unsplash.com/photo-1529006557810-274b9b2fc783',
    '123 Rue de la République, 75001 Paris',
    ST_MakePoint(2.3522, 48.8566)::geography,
    '+33 1 23 45 67 89',
    2.50,
    10.00,
    25,
    35,
    'active',
    4.5,
    128
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Istanbul Grill',
    'istanbul-grill',
    'Cuisine turque authentique, grillades au charbon',
    'https://images.unsplash.com/photo-1544025162-d76694265947',
    '456 Avenue des Champs-Élysées, 75008 Paris',
    ST_MakePoint(2.3060, 48.8698)::geography,
    '+33 1 98 76 54 32',
    3.00,
    15.00,
    30,
    45,
    'active',
    4.7,
    256
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Döner King',
    'doner-king',
    'Le roi du döner - Viande fraîche tous les jours',
    'https://images.unsplash.com/photo-1561651823-34feb02250e4',
    '789 Boulevard Haussmann, 75009 Paris',
    ST_MakePoint(2.3285, 48.8738)::geography,
    '+33 1 11 22 33 44',
    1.99,
    8.00,
    20,
    30,
    'active',
    4.3,
    89
  );

-- Restaurant categories
INSERT INTO restaurant_categories (restaurant_id, category)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'kebab'),
  ('11111111-1111-1111-1111-111111111111', 'grill'),
  ('22222222-2222-2222-2222-222222222222', 'kebab'),
  ('22222222-2222-2222-2222-222222222222', 'grill'),
  ('22222222-2222-2222-2222-222222222222', 'turkish'),
  ('33333333-3333-3333-3333-333333333333', 'doner'),
  ('33333333-3333-3333-3333-333333333333', 'fast-food');

-- Restaurant hours (all open 11:00-23:00 except Sunday)
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time, is_closed)
SELECT
  r.id,
  d.day,
  '11:00'::TIME,
  '23:00'::TIME,
  d.day = 0 -- Closed on Sunday
FROM restaurants r
CROSS JOIN (SELECT generate_series(0, 6) as day) d;

-- =====================================================
-- MENU CATEGORIES
-- =====================================================

-- Kebab Palace menu
INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order)
VALUES
  ('cat-11111111-assiettes', '11111111-1111-1111-1111-111111111111', 'Assiettes', 'Nos assiettes généreuses', 1),
  ('cat-11111111-sandwichs', '11111111-1111-1111-1111-111111111111', 'Sandwichs', 'Nos sandwichs maison', 2),
  ('cat-11111111-boissons', '11111111-1111-1111-1111-111111111111', 'Boissons', 'Boissons fraîches', 3);

-- Istanbul Grill menu
INSERT INTO menu_categories (id, restaurant_id, name, description, sort_order)
VALUES
  ('cat-22222222-grillades', '22222222-2222-2222-2222-222222222222', 'Grillades', 'Viandes grillées au charbon', 1),
  ('cat-22222222-mezze', '22222222-2222-2222-2222-222222222222', 'Mezze', 'Entrées turques traditionnelles', 2),
  ('cat-22222222-desserts', '22222222-2222-2222-2222-222222222222', 'Desserts', 'Douceurs orientales', 3);

-- =====================================================
-- MENU ITEMS
-- =====================================================

-- Kebab Palace items
INSERT INTO menu_items (id, category_id, restaurant_id, name, description, price, is_available, is_popular, allergens)
VALUES
  (
    'item-kebab-assiette',
    'cat-11111111-assiettes',
    '11111111-1111-1111-1111-111111111111',
    'Assiette Kebab',
    'Viande de kebab, frites fraîches, salade composée, sauce au choix',
    9.50,
    true,
    true,
    ARRAY['gluten']
  ),
  (
    'item-kebab-mixte',
    'cat-11111111-assiettes',
    '11111111-1111-1111-1111-111111111111',
    'Assiette Mixte',
    'Kebab + poulet grillé, frites, salade, sauces',
    12.50,
    true,
    true,
    ARRAY['gluten']
  ),
  (
    'item-kebab-sandwich',
    'cat-11111111-sandwichs',
    '11111111-1111-1111-1111-111111111111',
    'Sandwich Kebab',
    'Pain maison, viande kebab, crudités, sauce',
    6.50,
    true,
    true,
    ARRAY['gluten']
  ),
  (
    'item-doner-sandwich',
    'cat-11111111-sandwichs',
    '11111111-1111-1111-1111-111111111111',
    'Döner Sandwich',
    'Pain pita, döner, oignons, tomates, sauce yogurt',
    7.00,
    true,
    false,
    ARRAY['gluten', 'dairy']
  ),
  (
    'item-coca',
    'cat-11111111-boissons',
    '11111111-1111-1111-1111-111111111111',
    'Coca-Cola 33cl',
    'Coca-Cola classique',
    2.50,
    true,
    false,
    NULL
  ),
  (
    'item-ayran',
    'cat-11111111-boissons',
    '11111111-1111-1111-1111-111111111111',
    'Ayran',
    'Boisson turque au yaourt',
    2.00,
    true,
    true,
    ARRAY['dairy']
  );

-- =====================================================
-- MENU ITEM OPTIONS
-- =====================================================

-- Size option for Assiette Kebab
INSERT INTO menu_item_options (id, item_id, name, type, is_required)
VALUES ('opt-kebab-size', 'item-kebab-assiette', 'Taille', 'single', true);

INSERT INTO menu_item_option_choices (option_id, name, price_modifier, is_default, sort_order)
VALUES
  ('opt-kebab-size', 'Normal', 0, true, 1),
  ('opt-kebab-size', 'XL', 2.00, false, 2),
  ('opt-kebab-size', 'XXL', 4.00, false, 3);

-- Sauce option for Assiette Kebab
INSERT INTO menu_item_options (id, item_id, name, type, is_required)
VALUES ('opt-kebab-sauce', 'item-kebab-assiette', 'Sauce', 'single', true);

INSERT INTO menu_item_option_choices (option_id, name, price_modifier, is_default, sort_order)
VALUES
  ('opt-kebab-sauce', 'Sauce Blanche', 0, true, 1),
  ('opt-kebab-sauce', 'Harissa', 0, false, 2),
  ('opt-kebab-sauce', 'Samouraï', 0, false, 3),
  ('opt-kebab-sauce', 'Algérienne', 0, false, 4),
  ('opt-kebab-sauce', 'Ketchup', 0, false, 5);

-- Extras option for Assiette Kebab
INSERT INTO menu_item_options (id, item_id, name, type, is_required, max_selections)
VALUES ('opt-kebab-extras', 'item-kebab-assiette', 'Suppléments', 'multiple', false, 3);

INSERT INTO menu_item_option_choices (option_id, name, price_modifier, is_default, sort_order)
VALUES
  ('opt-kebab-extras', 'Fromage fondu', 1.00, false, 1),
  ('opt-kebab-extras', 'Oeuf au plat', 1.00, false, 2),
  ('opt-kebab-extras', 'Double viande', 3.00, false, 3);

-- =====================================================
-- PROMO CODES
-- =====================================================

INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_value, valid_until, is_active)
VALUES
  ('BIENVENUE', 'Remise de bienvenue - 20% sur votre première commande', 'percentage', 20, 15, NOW() + INTERVAL '1 year', true),
  ('TURKEATS10', '10% de réduction sur toutes les commandes', 'percentage', 10, 10, NOW() + INTERVAL '6 months', true),
  ('LIVRAISON', 'Livraison gratuite', 'fixed', 3, 20, NOW() + INTERVAL '3 months', true);

-- =====================================================
-- Note: User profiles are created automatically via Supabase Auth triggers
-- Orders, reviews, etc. will be created through the application
-- =====================================================
