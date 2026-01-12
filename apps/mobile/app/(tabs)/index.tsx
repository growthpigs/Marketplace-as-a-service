import { View, ScrollView, Text, StyleSheet, Modal, TextInput, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
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
 * FEATURES:
 * - Category filtering (Kebab, Pide, etc.)
 * - Search functionality
 * - Filter chips (Offres, Livraison, Retrait)
 * - Restaurant feed with real filtering
 */

// Extended Restaurant type with categories
interface RestaurantWithCategories extends Restaurant {
  categories: string[];
  hasOffer?: boolean;
  hasDelivery?: boolean;
  hasPickup?: boolean;
}

// Mock Turkish restaurant data with categories
const MOCK_RESTAURANTS: RestaurantWithCategories[] = [
  {
    id: '1',
    name: 'Kebab Palace',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 128,
    deliveryTime: '15-25 min',
    minOrder: 10,
    distance: '1.2 km',
    promo: 'Top offer • 2 offres disponibles',
    categories: ['kebab', 'sandwich', 'assiette'],
    hasOffer: true,
    hasDelivery: true,
    hasPickup: true,
  },
  {
    id: '2',
    name: 'Istanbul Grill',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 256,
    deliveryTime: '20-30 min',
    minOrder: 8,
    distance: '0.8 km',
    promo: '€0 Frais de livraison',
    categories: ['kebab', 'pide', 'lahmacun', 'assiette'],
    hasOffer: true,
    hasDelivery: true,
    hasPickup: false,
  },
  {
    id: '3',
    name: 'Döner King',
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 189,
    deliveryTime: '18-28 min',
    minOrder: 12,
    distance: '1.5 km',
    categories: ['kebab', 'sandwich'],
    hasOffer: false,
    hasDelivery: true,
    hasPickup: true,
  },
  {
    id: '4',
    name: 'Anatolian Kitchen',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 312,
    deliveryTime: '25-35 min',
    minOrder: 15,
    distance: '2.1 km',
    promo: '#1 most liked',
    categories: ['pide', 'lahmacun', 'soup', 'desserts'],
    hasOffer: true,
    hasDelivery: true,
    hasPickup: true,
  },
  {
    id: '5',
    name: 'Sultan Kebab',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 97,
    deliveryTime: '15-20 min',
    minOrder: 8,
    distance: '0.5 km',
    categories: ['kebab', 'assiette', 'sandwich'],
    hasOffer: false,
    hasDelivery: true,
    hasPickup: false,
  },
  {
    id: '6',
    name: 'Pide House',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 445,
    deliveryTime: '20-30 min',
    minOrder: 12,
    distance: '1.8 km',
    promo: 'Nouveau',
    categories: ['pide', 'lahmacun'],
    hasOffer: true,
    hasDelivery: true,
    hasPickup: true,
  },
  {
    id: '7',
    name: 'Turkish Delights',
    image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 78,
    deliveryTime: '15-25 min',
    minOrder: 5,
    distance: '0.3 km',
    categories: ['desserts', 'tea'],
    hasOffer: false,
    hasDelivery: true,
    hasPickup: true,
  },
  {
    id: '8',
    name: 'Soup & Çorba',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 156,
    deliveryTime: '10-20 min',
    minOrder: 6,
    distance: '0.9 km',
    categories: ['soup'],
    hasOffer: false,
    hasDelivery: true,
    hasPickup: false,
  },
];

// Category name mapping for display
const CATEGORY_NAMES: Record<string, string> = {
  assiette: 'Assiette',
  sandwich: 'Sandwich',
  soup: 'Soupe',
  pide: 'Pide',
  kebab: 'Kebab',
  desserts: 'Desserts',
  tea: 'Thé',
  lahmacun: 'Lahmacun',
};

export default function HomeScreen() {
  const router = useRouter();

  // State for filtering
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('123 Rue de la République');

  // Filter restaurants based on category, filters, and search
  const filteredRestaurants = useMemo(() => {
    let results = MOCK_RESTAURANTS;

    // Filter by category
    if (selectedCategory) {
      results = results.filter((r) => r.categories.includes(selectedCategory));
    }

    // Filter by chips
    if (selectedFilters.includes('offres')) {
      results = results.filter((r) => r.hasOffer);
    }
    if (selectedFilters.includes('livraison')) {
      results = results.filter((r) => r.hasDelivery);
    }
    if (selectedFilters.includes('retrait')) {
      results = results.filter((r) => r.hasPickup);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.categories.some((c) => CATEGORY_NAMES[c]?.toLowerCase().includes(query))
      );
    }

    return results;
  }, [selectedCategory, selectedFilters, searchQuery]);

  // Handle category press
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  // Handle filter press
  const handleFilterPress = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  // Handle location press - navigate to address selection
  const handleLocationPress = () => {
    router.push('/checkout/address');
  };

  // Get section title based on filters
  const getSectionTitle = () => {
    if (selectedCategory) {
      return CATEGORY_NAMES[selectedCategory] || 'Résultats';
    }
    if (searchQuery.trim()) {
      return `Résultats pour "${searchQuery}"`;
    }
    return 'À la une sur TurkEats';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Fixed Header */}
      <HomeHeader
        address={deliveryAddress}
        onLocationPress={handleLocationPress}
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
          onPress={() => setIsSearchVisible(true)}
        />

        {/* Category Row */}
        <CategoryRow
          selectedCategory={selectedCategory}
          onCategoryPress={handleCategoryPress}
        />

        {/* Filter Chips */}
        <FilterChips
          selectedFilters={selectedFilters}
          onFilterPress={handleFilterPress}
        />

        {/* Active Filters Display */}
        {(selectedCategory || selectedFilters.length > 0) && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersText}>
              {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} trouvé{filteredRestaurants.length !== 1 ? 's' : ''}
            </Text>
            <Pressable onPress={() => { setSelectedCategory(null); setSelectedFilters([]); }}>
              <Text style={styles.clearFiltersText}>Effacer les filtres</Text>
            </Pressable>
          </View>
        )}

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>
          <Pressable onPress={() => { setSelectedCategory(null); setSelectedFilters([]); }}>
            <Text style={styles.sectionLink}>Voir tout</Text>
          </Pressable>
        </View>

        {/* Restaurant Feed */}
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() => router.push(`/restaurant/${restaurant.id}`)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="search" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Aucun restaurant trouvé</Text>
            <Text style={styles.emptySubtitle}>
              Essayez d'autres filtres ou catégories
            </Text>
            <Pressable
              style={styles.clearButton}
              onPress={() => { setSelectedCategory(null); setSelectedFilters([]); setSearchQuery(''); }}
            >
              <Text style={styles.clearButtonText}>Réinitialiser</Text>
            </Pressable>
          </View>
        )}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Search Modal */}
      <Modal
        visible={isSearchVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsSearchVisible(false)}
      >
        <View style={styles.searchModal}>
          <View style={styles.searchModalHeader}>
            <Pressable onPress={() => setIsSearchVisible(false)}>
              <FontAwesome name="arrow-left" size={20} color="#000000" />
            </Pressable>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher restaurants, plats..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={() => setIsSearchVisible(false)}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={20} color="#9CA3AF" />
              </Pressable>
            )}
          </View>

          {/* Quick category suggestions */}
          <View style={styles.searchSuggestions}>
            <Text style={styles.suggestionsTitle}>Catégories populaires</Text>
            {['kebab', 'pide', 'lahmacun', 'desserts'].map((cat) => (
              <Pressable
                key={cat}
                style={styles.suggestionItem}
                onPress={() => {
                  setSelectedCategory(cat);
                  setIsSearchVisible(false);
                }}
              >
                <FontAwesome name="search" size={16} color="#6B7280" />
                <Text style={styles.suggestionText}>{CATEGORY_NAMES[cat]}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
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
    flex: 1,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#06C167',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
  },
  activeFiltersText: {
    fontSize: 14,
    color: '#374151',
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#06C167',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Search Modal
  searchModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 8,
  },
  searchSuggestions: {
    padding: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: '#000000',
  },
});
