import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { View, ScrollView, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { RestaurantHero } from '@/components/restaurant/RestaurantHero';
import { RestaurantInfo } from '@/components/restaurant/RestaurantInfo';
import { MenuSection } from '@/components/restaurant/MenuSection';
import { MenuItem, type MenuItemData } from '@/components/restaurant/MenuItem';
import { FloatingCartButton } from '@/components/restaurant/FloatingCartButton';

/**
 * RestaurantDetail - Pixel-perfect copy of Uber Eats restaurant page
 *
 * UBER EATS LAYOUT:
 * 1. Hero image with back button overlay (parallax)
 * 2. Restaurant name, rating, delivery info
 * 3. Tab bar (Menu, Info, Reviews) - simplified to just Menu
 * 4. Menu sections with items
 * 5. Floating cart button at bottom
 *
 * LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ [← Back]              [♡] [⋯]     │ ← Overlay on hero
 * │                                     │
 * │      [HERO IMAGE - FULL WIDTH]      │
 * │                                     │
 * ├─────────────────────────────────────┤
 * │ Restaurant Name              ★ 4.5 │
 * │ €€ • Turkish • 1.2km               │
 * │ 15-25 min delivery • €0.49 fee     │
 * ├─────────────────────────────────────┤
 * │ Most Popular                        │
 * │ ┌─────────────────────┬────────┐   │
 * │ │ Döner Sandwich      │ [IMG]  │   │
 * │ │ €7.50               │        │   │
 * │ └─────────────────────┴────────┘   │
 * │ ┌─────────────────────┬────────┐   │
 * │ │ Assiette Grec       │ [IMG]  │   │
 * │ │ €12.90              │        │   │
 * │ └─────────────────────┴────────┘   │
 * ├─────────────────────────────────────┤
 * │ Kebabs                              │
 * │ ...                                 │
 * ├─────────────────────────────────────┤
 * │ [   View cart • 2 items - €20.40   ]│ ← Floating button
 * └─────────────────────────────────────┘
 */

// Mock restaurant data (would come from API in production)
const MOCK_RESTAURANTS: Record<string, {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  reviewCount: number;
  priceLevel: string;
  cuisine: string;
  distance: string;
  deliveryTime: string;
  deliveryFee: string;
  menu: { section: string; items: MenuItemData[] }[];
}> = {
  '1': {
    id: '1',
    name: 'Kebab Palace',
    image: null,
    rating: 4.5,
    reviewCount: 128,
    priceLevel: '€€',
    cuisine: 'Turkish',
    distance: '1.2 km',
    deliveryTime: '15-25 min',
    deliveryFee: '€0.49',
    menu: [
      {
        section: 'Les plus populaires',
        items: [
          {
            id: '1-1',
            name: 'Döner Sandwich',
            description: 'Viande döner grillée, salade fraîche, sauce blanche, dans un pain pita croustillant',
            price: 7.50,
            image: null,
            popular: true,
          },
          {
            id: '1-2',
            name: 'Assiette Grec',
            description: 'Döner, riz pilaf, salade, frites maison, sauce blanche et sauce piquante',
            price: 12.90,
            image: null,
            popular: true,
          },
          {
            id: '1-3',
            name: 'Assiette Mixte',
            description: 'Mélange de döner et poulet grillé avec riz, frites et salade',
            price: 14.90,
            image: null,
          },
        ],
      },
      {
        section: 'Sandwiches',
        items: [
          {
            id: '2-1',
            name: 'Sandwich Poulet',
            description: 'Poulet grillé mariné, salade, oignons, sauce blanche',
            price: 7.50,
            image: null,
          },
          {
            id: '2-2',
            name: 'Sandwich Falafel',
            description: 'Falafel maison, houmous, salade, sauce tahini',
            price: 6.90,
            image: null,
          },
          {
            id: '2-3',
            name: 'Sandwich Mixte',
            description: 'Döner et poulet, salade, sauce blanche et piquante',
            price: 8.50,
            image: null,
          },
        ],
      },
      {
        section: 'Assiettes',
        items: [
          {
            id: '3-1',
            name: 'Assiette Poulet',
            description: 'Poulet grillé, riz, frites, salade, sauces',
            price: 12.90,
            image: null,
          },
          {
            id: '3-2',
            name: 'Assiette Brochettes',
            description: 'Brochettes de viande grillée, riz, salade',
            price: 15.90,
            image: null,
          },
        ],
      },
      {
        section: 'Boissons',
        items: [
          {
            id: '4-1',
            name: 'Ayran',
            description: 'Boisson au yaourt turc traditionnel',
            price: 2.50,
            image: null,
          },
          {
            id: '4-2',
            name: 'Thé turc',
            description: 'Çay traditionnel servi dans un verre tulipe',
            price: 2.00,
            image: null,
          },
          {
            id: '4-3',
            name: 'Coca-Cola',
            description: '33cl',
            price: 2.50,
            image: null,
          },
        ],
      },
      {
        section: 'Desserts',
        items: [
          {
            id: '5-1',
            name: 'Baklava (3 pièces)',
            description: 'Pâtisserie feuilletée aux noix et miel',
            price: 5.20,
            image: null,
          },
          {
            id: '5-2',
            name: 'Künefe',
            description: 'Dessert au fromage avec pâte kadaïf, sirop de sucre',
            price: 6.50,
            image: null,
          },
        ],
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Istanbul Grill',
    image: null,
    rating: 4.7,
    reviewCount: 256,
    priceLevel: '€€',
    cuisine: 'Turkish',
    distance: '0.8 km',
    deliveryTime: '20-30 min',
    deliveryFee: '€0',
    menu: [
      {
        section: 'Les plus populaires',
        items: [
          {
            id: '1-1',
            name: 'Iskender Kebab',
            description: 'Döner sur pain, sauce tomate, beurre fondu, yaourt',
            price: 14.90,
            image: null,
            popular: true,
          },
          {
            id: '1-2',
            name: 'Adana Kebab',
            description: 'Brochette de viande hachée épicée, accompagnements turcs',
            price: 13.50,
            image: null,
          },
        ],
      },
      {
        section: 'Pide',
        items: [
          {
            id: '2-1',
            name: 'Pide Viande',
            description: 'Pain bateau turc garni de viande hachée',
            price: 9.80,
            image: null,
          },
          {
            id: '2-2',
            name: 'Pide Fromage',
            description: 'Pain bateau turc garni de fromage fondu',
            price: 8.50,
            image: null,
          },
        ],
      },
    ],
  },
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Get restaurant data (fallback to first restaurant if not found)
  const restaurant = MOCK_RESTAURANTS[id as string] ?? MOCK_RESTAURANTS['1'];

  // Mock cart state (would be managed by state management in production)
  const cartItemCount = 0;
  const cartTotal = 0;

  const handleAddToCart = (item: MenuItemData) => {
    console.log('Add to cart:', item.name);
    // Would dispatch to cart state
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Hide the default header - we have a custom overlay */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Image with Back Button Overlay */}
        <RestaurantHero
          image={restaurant.image}
          onBackPress={() => router.back()}
          onFavoritePress={() => console.log('Favorite pressed')}
          onMorePress={() => console.log('More pressed')}
        />

        {/* Restaurant Info */}
        <RestaurantInfo
          name={restaurant.name}
          rating={restaurant.rating}
          reviewCount={restaurant.reviewCount}
          priceLevel={restaurant.priceLevel}
          cuisine={restaurant.cuisine}
          distance={restaurant.distance}
          deliveryTime={restaurant.deliveryTime}
          deliveryFee={restaurant.deliveryFee}
        />

        {/* Menu Sections */}
        {restaurant.menu.map((section, index) => (
          <View key={section.section}>
            <MenuSection title={section.section} />
            {section.items.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                onPress={() => handleAddToCart(item)}
              />
            ))}
          </View>
        ))}

        {/* Bottom padding for cart button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <FloatingCartButton
          itemCount={cartItemCount}
          total={cartTotal}
          onPress={() => router.push('/baskets')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
});
