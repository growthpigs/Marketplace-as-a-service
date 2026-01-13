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
import { useCart } from '@/context/CartContext';

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
// Images from Unsplash - Turkish food photography
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
    // Rotating döner spit - iconic Turkish kebab
    image: 'https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=800&h=500&fit=crop',
    rating: 4.5,
    reviewCount: 128,
    priceLevel: '€€',
    cuisine: 'Turkish',
    distance: '0.3 km',
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
            // Döner wrap/sandwich
            image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=200&h=200&fit=crop',
            popular: true,
          },
          {
            id: '1-2',
            name: 'Assiette Grec',
            description: 'Döner, riz pilaf, salade, frites maison, sauce blanche et sauce piquante',
            price: 12.90,
            // Kebab plate with rice and salad
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop',
            popular: true,
          },
          {
            id: '1-3',
            name: 'Assiette Mixte',
            description: 'Mélange de döner et poulet grillé avec riz, frites et salade',
            price: 14.90,
            // Mixed grill plate
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
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
            // Grilled chicken wrap
            image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&h=200&fit=crop',
          },
          {
            id: '2-2',
            name: 'Sandwich Falafel',
            description: 'Falafel maison, houmous, salade, sauce tahini',
            price: 6.90,
            // Falafel wrap
            image: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=200&h=200&fit=crop',
          },
          {
            id: '2-3',
            name: 'Sandwich Mixte',
            description: 'Döner et poulet, salade, sauce blanche et piquante',
            price: 8.50,
            // Mixed meat wrap
            image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&h=200&fit=crop',
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
            // Chicken plate
            image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200&h=200&fit=crop',
          },
          {
            id: '3-2',
            name: 'Assiette Brochettes',
            description: 'Brochettes de viande grillée, riz, salade',
            price: 15.90,
            // Skewers plate
            image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200&h=200&fit=crop',
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
            // Ayran yogurt drink
            image: 'https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=200&h=200&fit=crop',
          },
          {
            id: '4-2',
            name: 'Thé turc',
            description: 'Çay traditionnel servi dans un verre tulipe',
            price: 2.00,
            // Turkish tea in traditional glass
            image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&h=200&fit=crop',
          },
          {
            id: '4-3',
            name: 'Coca-Cola',
            description: '33cl',
            price: 2.50,
            // Cola drink
            image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop',
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
            // Baklava pastry
            image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=200&h=200&fit=crop',
          },
          {
            id: '5-2',
            name: 'Künefe',
            description: 'Dessert au fromage avec pâte kadaïf, sirop de sucre',
            price: 6.50,
            // Künefe dessert
            image: 'https://images.unsplash.com/photo-1625498542602-6bfb30f39b3a?w=200&h=200&fit=crop',
          },
        ],
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Istanbul Grill',
    // Turkish mixed grill spread
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop',
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
            // Iskender kebab with sauce
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop',
            popular: true,
          },
          {
            id: '1-2',
            name: 'Adana Kebab',
            description: 'Brochette de viande hachée épicée, accompagnements turcs',
            price: 13.50,
            // Adana kebab on skewer
            image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&h=200&fit=crop',
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
            // Turkish pide with meat
            image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=200&h=200&fit=crop',
          },
          {
            id: '2-2',
            name: 'Pide Fromage',
            description: 'Pain bateau turc garni de fromage fondu',
            price: 8.50,
            // Cheese pide
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
          },
        ],
      },
      {
        section: 'Grillades',
        items: [
          {
            id: '3-1',
            name: 'Shish Kebab',
            description: 'Cubes de viande marinée sur brochette, légumes grillés',
            price: 14.50,
            // Shish kebab skewers
            image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200&h=200&fit=crop',
          },
          {
            id: '3-2',
            name: 'Tavuk Şiş',
            description: 'Brochettes de poulet mariné aux épices turques',
            price: 12.90,
            // Chicken skewers
            image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200&h=200&fit=crop',
          },
          {
            id: '3-3',
            name: 'Karışık Izgara',
            description: 'Assortiment de grillades: döner, adana, shish, poulet',
            price: 18.90,
            // Mixed grill platter
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
          },
        ],
      },
      {
        section: 'Mezze',
        items: [
          {
            id: '4-1',
            name: 'Houmous',
            description: 'Purée de pois chiches, tahini, huile d\'olive',
            price: 5.50,
            // Hummus
            image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=200&h=200&fit=crop',
          },
          {
            id: '4-2',
            name: 'Cacık',
            description: 'Yaourt turc, concombre, ail, menthe',
            price: 4.90,
            // Cacik/tzatziki
            image: 'https://images.unsplash.com/photo-1571167530149-c1105da4c2c7?w=200&h=200&fit=crop',
          },
        ],
      },
      {
        section: 'Desserts',
        items: [
          {
            id: '5-1',
            name: 'Baklava Assortiment',
            description: 'Sélection de 6 pièces de baklava variés',
            price: 8.90,
            // Baklava assortment
            image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=200&h=200&fit=crop',
          },
          {
            id: '5-2',
            name: 'Sütlaç',
            description: 'Riz au lait turc caramélisé',
            price: 5.50,
            // Rice pudding
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop',
          },
        ],
      },
    ],
  },
  // Add more restaurants that match the home screen
  '3': {
    id: '3',
    name: 'Döner King',
    // Döner wrap being prepared
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&h=500&fit=crop',
    rating: 4.6,
    reviewCount: 189,
    priceLevel: '€',
    cuisine: 'Turkish Fast Food',
    distance: '1.5 km',
    deliveryTime: '18-28 min',
    deliveryFee: '€0.99',
    menu: [
      {
        section: 'Les plus populaires',
        items: [
          {
            id: '1-1',
            name: 'Döner Box',
            description: 'Döner haché, frites croustillantes, sauce signature',
            price: 9.90,
            image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=200&h=200&fit=crop',
            popular: true,
          },
          {
            id: '1-2',
            name: 'Döner Galette',
            description: 'Döner dans une galette de blé, crudités, sauce',
            price: 8.50,
            image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=200&h=200&fit=crop',
          },
        ],
      },
      {
        section: 'Formules',
        items: [
          {
            id: '2-1',
            name: 'Menu Döner',
            description: 'Sandwich döner + frites + boisson',
            price: 11.90,
            image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=200&h=200&fit=crop',
          },
          {
            id: '2-2',
            name: 'Menu Assiette',
            description: 'Assiette döner + boisson',
            price: 14.90,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop',
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

  // Cart state from context
  const { addItem, itemCount, total } = useCart();

  const handleAddToCart = (item: MenuItemData) => {
    addItem(
      restaurant.id,
      restaurant.name,
      {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
      },
      10 // minOrder €10
    );
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

      {/* Floating Cart Button - Navigate to checkout address screen */}
      {itemCount > 0 && (
        <FloatingCartButton
          itemCount={itemCount}
          total={total}
          onPress={() => router.push('/checkout/address')}
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
