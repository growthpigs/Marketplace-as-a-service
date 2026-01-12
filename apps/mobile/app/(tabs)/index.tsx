import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
  HomeHeader,
  SearchBar,
  CategoryRow,
  FilterChips,
  RestaurantCard,
  type Restaurant,
} from '@/components/home';

/**
 * HomeScreen - Pixel-perfect copy of Uber Eats home screen
 *
 * UBER EATS LAYOUT:
 * 1. Header (location picker + notification bell)
 * 2. Search bar
 * 3. Category icons (horizontal scroll)
 * 4. Filter chips (horizontal scroll)
 * 5. Section: "À la une sur TurkEats"
 * 6. Restaurant feed (vertical scroll)
 */

// Mock Turkish restaurant data
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Kebab Palace',
    image: null, // Will be replaced with real image URL
    rating: 4.5,
    reviewCount: 128,
    deliveryTime: '15-25 min',
    minOrder: 10,
    distance: '1.2 km',
    promo: 'Top offer • 2 offres disponibles',
  },
  {
    id: '2',
    name: 'Istanbul Grill',
    image: null,
    rating: 4.7,
    reviewCount: 256,
    deliveryTime: '20-30 min',
    minOrder: 8,
    distance: '0.8 km',
    promo: '€0 Frais de livraison',
  },
  {
    id: '3',
    name: 'Döner King',
    image: null,
    rating: 4.6,
    reviewCount: 189,
    deliveryTime: '18-28 min',
    minOrder: 12,
    distance: '1.5 km',
  },
  {
    id: '4',
    name: 'Anatolian Kitchen',
    image: null,
    rating: 4.8,
    reviewCount: 312,
    deliveryTime: '25-35 min',
    minOrder: 15,
    distance: '2.1 km',
    promo: '#1 most liked',
  },
  {
    id: '5',
    name: 'Sultan Kebab',
    image: null,
    rating: 4.4,
    reviewCount: 97,
    deliveryTime: '15-20 min',
    minOrder: 8,
    distance: '0.5 km',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Fixed Header */}
      <HomeHeader
        address="123 Rue de la République"
        onLocationPress={() => console.log('Location pressed')}
        onNotificationPress={() => console.log('Notifications pressed')}
      />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <SearchBar
          placeholder="Rechercher TurkEats"
          onPress={() => console.log('Search pressed')}
        />

        {/* Category Row */}
        <CategoryRow
          onCategoryPress={(id) => console.log('Category pressed:', id)}
        />

        {/* Filter Chips */}
        <FilterChips
          onFilterPress={(id) => console.log('Filter pressed:', id)}
        />

        {/* Section: Featured */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>À la une sur TurkEats</Text>
          <Text style={styles.sectionLink}>Voir tout</Text>
        </View>

        {/* Restaurant Feed */}
        {MOCK_RESTAURANTS.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() => router.push(`/restaurant/${restaurant.id}`)}
          />
        ))}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#06C167', // TurkEats green
  },
});
