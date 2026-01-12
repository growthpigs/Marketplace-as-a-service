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

// 50 Turkish restaurants around 92250 La Garenne-Colombes area
const MOCK_RESTAURANTS: RestaurantWithCategories[] = [
  // === KEBAB SPECIALISTS ===
  { id: '1', name: 'Kebab Palace', image: 'https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 128, deliveryTime: '15-25 min', minOrder: 10, distance: '0.3 km', promo: 'Top offer • 2 offres', categories: ['kebab'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '2', name: 'Le Roi du Döner', image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&h=300&fit=crop', rating: 4.6, reviewCount: 189, deliveryTime: '18-28 min', minOrder: 12, distance: '0.5 km', categories: ['kebab'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '3', name: 'Adana Express', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 97, deliveryTime: '15-20 min', minOrder: 8, distance: '0.7 km', categories: ['kebab'], hasOffer: false, hasDelivery: true, hasPickup: false },
  { id: '4', name: 'Iskender House', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop', rating: 4.7, reviewCount: 234, deliveryTime: '20-30 min', minOrder: 14, distance: '1.1 km', promo: '€0 Frais de livraison', categories: ['kebab'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '5', name: 'Kebab Antalya', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', rating: 4.3, reviewCount: 156, deliveryTime: '15-25 min', minOrder: 10, distance: '1.3 km', categories: ['kebab'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '6', name: 'Sultan Grill', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', rating: 4.8, reviewCount: 312, deliveryTime: '20-35 min', minOrder: 15, distance: '1.5 km', promo: '#1 most liked', categories: ['kebab'], hasOffer: true, hasDelivery: true, hasPickup: true },

  // === SANDWICH SPECIALISTS ===
  { id: '7', name: 'Döner Wrap Express', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop', rating: 4.2, reviewCount: 89, deliveryTime: '10-18 min', minOrder: 6, distance: '0.2 km', categories: ['sandwich'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '8', name: 'Turkish Sandwich Co', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 167, deliveryTime: '12-20 min', minOrder: 7, distance: '0.4 km', promo: 'Nouveau', categories: ['sandwich'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '9', name: 'Le Durum', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 203, deliveryTime: '15-22 min', minOrder: 8, distance: '0.6 km', categories: ['sandwich'], hasOffer: false, hasDelivery: true, hasPickup: false },
  { id: '10', name: 'Wrap & Roll Istanbul', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop', rating: 4.6, reviewCount: 178, deliveryTime: '12-18 min', minOrder: 9, distance: '0.8 km', promo: '-20% première commande', categories: ['sandwich'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '11', name: 'Pita Palace', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop', rating: 4.3, reviewCount: 134, deliveryTime: '15-25 min', minOrder: 8, distance: '1.0 km', categories: ['sandwich'], hasOffer: false, hasDelivery: true, hasPickup: true },

  // === ASSIETTE (PLATE) SPECIALISTS ===
  { id: '12', name: 'Anatolian Kitchen', image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=300&fit=crop', rating: 4.8, reviewCount: 445, deliveryTime: '25-35 min', minOrder: 15, distance: '0.9 km', promo: '#1 most liked', categories: ['assiette'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '13', name: 'Istanbul Grill', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', rating: 4.7, reviewCount: 256, deliveryTime: '20-30 min', minOrder: 12, distance: '1.2 km', promo: '€0 Frais de livraison', categories: ['assiette'], hasOffer: true, hasDelivery: true, hasPickup: false },
  { id: '14', name: 'Meze Garden', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 198, deliveryTime: '25-40 min', minOrder: 18, distance: '1.4 km', categories: ['assiette'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '15', name: 'Le Festin Turc', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', rating: 4.6, reviewCount: 287, deliveryTime: '30-45 min', minOrder: 20, distance: '1.6 km', promo: 'Menu famille -15%', categories: ['assiette'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '16', name: 'Cappadoce', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 167, deliveryTime: '25-35 min', minOrder: 16, distance: '1.8 km', categories: ['assiette'], hasOffer: false, hasDelivery: true, hasPickup: false },

  // === PIDE SPECIALISTS ===
  { id: '17', name: 'Pide House', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop', rating: 4.9, reviewCount: 445, deliveryTime: '20-30 min', minOrder: 12, distance: '0.4 km', promo: 'Nouveau', categories: ['pide'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '18', name: 'Pide & Lahmacun', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', rating: 4.6, reviewCount: 234, deliveryTime: '18-28 min', minOrder: 10, distance: '0.7 km', categories: ['pide'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '19', name: 'Karadeniz Pide', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', rating: 4.7, reviewCount: 189, deliveryTime: '20-32 min', minOrder: 11, distance: '1.0 km', promo: '2ème pide -50%', categories: ['pide'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '20', name: 'Pide Express', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 156, deliveryTime: '15-25 min', minOrder: 9, distance: '1.3 km', categories: ['pide'], hasOffer: false, hasDelivery: true, hasPickup: false },
  { id: '21', name: 'Trabzon Pidecisi', image: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 201, deliveryTime: '22-35 min', minOrder: 13, distance: '1.5 km', categories: ['pide'], hasOffer: false, hasDelivery: true, hasPickup: true },

  // === LAHMACUN SPECIALISTS ===
  { id: '22', name: 'Lahmacun King', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 178, deliveryTime: '12-20 min', minOrder: 8, distance: '0.3 km', promo: '3 pour 2', categories: ['lahmacun'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '23', name: 'Urfa Lahmacun', image: 'https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=400&h=300&fit=crop', rating: 4.6, reviewCount: 212, deliveryTime: '15-22 min', minOrder: 7, distance: '0.6 km', categories: ['lahmacun'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '24', name: 'Antep Lahmacun', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 145, deliveryTime: '12-18 min', minOrder: 6, distance: '0.9 km', promo: 'Livraison gratuite', categories: ['lahmacun'], hasOffer: true, hasDelivery: true, hasPickup: false },
  { id: '25', name: 'Le Lahmacun', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', rating: 4.3, reviewCount: 98, deliveryTime: '10-18 min', minOrder: 5, distance: '1.1 km', categories: ['lahmacun'], hasOffer: false, hasDelivery: true, hasPickup: true },

  // === SOUP SPECIALISTS ===
  { id: '26', name: 'Soup & Çorba', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 156, deliveryTime: '10-20 min', minOrder: 6, distance: '0.4 km', categories: ['soup'], hasOffer: false, hasDelivery: true, hasPickup: false },
  { id: '27', name: 'Mercimek Evi', image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&h=300&fit=crop', rating: 4.7, reviewCount: 189, deliveryTime: '12-22 min', minOrder: 7, distance: '0.7 km', promo: 'Soupe offerte dès €15', categories: ['soup'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '28', name: 'Çorba House', image: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 123, deliveryTime: '10-18 min', minOrder: 5, distance: '1.0 km', categories: ['soup'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '29', name: 'Tarhana Express', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&h=300&fit=crop', rating: 4.3, reviewCount: 87, deliveryTime: '8-15 min', minOrder: 4, distance: '1.2 km', categories: ['soup'], hasOffer: false, hasDelivery: true, hasPickup: false },

  // === DESSERT SPECIALISTS ===
  { id: '30', name: 'Turkish Delights', image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&h=300&fit=crop', rating: 4.6, reviewCount: 234, deliveryTime: '15-25 min', minOrder: 8, distance: '0.3 km', categories: ['desserts'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '31', name: 'Baklava Palace', image: 'https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=400&h=300&fit=crop', rating: 4.8, reviewCount: 345, deliveryTime: '18-28 min', minOrder: 10, distance: '0.6 km', promo: 'Box découverte -20%', categories: ['desserts'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '32', name: 'Künefe House', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop', rating: 4.7, reviewCount: 198, deliveryTime: '20-30 min', minOrder: 12, distance: '0.9 km', categories: ['desserts'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '33', name: 'Lokum & Co', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 167, deliveryTime: '15-22 min', minOrder: 9, distance: '1.1 km', promo: 'Nouveau', categories: ['desserts'], hasOffer: true, hasDelivery: true, hasPickup: false },
  { id: '34', name: 'Sütlaç Shop', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 134, deliveryTime: '12-20 min', minOrder: 7, distance: '1.4 km', categories: ['desserts'], hasOffer: false, hasDelivery: true, hasPickup: true },

  // === TEA SPECIALISTS ===
  { id: '35', name: 'Çay Evi', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 145, deliveryTime: '10-18 min', minOrder: 5, distance: '0.2 km', categories: ['tea'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '36', name: 'Turkish Tea Garden', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', rating: 4.7, reviewCount: 201, deliveryTime: '12-20 min', minOrder: 6, distance: '0.5 km', promo: 'Thé offert dès €10', categories: ['tea'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '37', name: 'Kahve & Çay', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 123, deliveryTime: '8-15 min', minOrder: 4, distance: '0.8 km', categories: ['tea'], hasOffer: false, hasDelivery: true, hasPickup: true },

  // === MIXED RESTAURANTS (Multiple Categories) ===
  { id: '38', name: 'La Garenne Kebab', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', rating: 4.6, reviewCount: 289, deliveryTime: '15-25 min', minOrder: 10, distance: '0.1 km', promo: 'Livraison gratuite', categories: ['kebab', 'sandwich'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '39', name: 'Courbevoie Grill', image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 234, deliveryTime: '18-28 min', minOrder: 11, distance: '0.8 km', categories: ['kebab', 'assiette'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '40', name: 'Nanterre Turkish', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 178, deliveryTime: '20-32 min', minOrder: 12, distance: '1.5 km', promo: '-10% emporter', categories: ['pide', 'lahmacun'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '41', name: 'Bois-Colombes Döner', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop', rating: 4.3, reviewCount: 145, deliveryTime: '15-22 min', minOrder: 9, distance: '1.0 km', categories: ['kebab', 'sandwich'], hasOffer: false, hasDelivery: true, hasPickup: false },
  { id: '42', name: 'Colombes Pide', image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400&h=300&fit=crop', rating: 4.7, reviewCount: 267, deliveryTime: '22-35 min', minOrder: 13, distance: '1.3 km', promo: '#2 most liked', categories: ['pide', 'assiette'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '43', name: 'Asnières Grill House', image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 198, deliveryTime: '18-30 min', minOrder: 14, distance: '1.7 km', categories: ['assiette', 'soup'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '44', name: 'Levallois Kebab', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop', rating: 4.6, reviewCount: 223, deliveryTime: '15-25 min', minOrder: 10, distance: '1.2 km', promo: 'Menu étudiant €8', categories: ['kebab', 'sandwich'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '45', name: 'Puteaux Turkish', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 167, deliveryTime: '20-30 min', minOrder: 11, distance: '1.4 km', categories: ['lahmacun', 'pide'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '46', name: 'Suresnes Anatolie', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop', rating: 4.8, reviewCount: 312, deliveryTime: '25-40 min', minOrder: 16, distance: '2.0 km', promo: 'Famille -15%', categories: ['assiette', 'desserts'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '47', name: 'Neuilly Döner', image: 'https://images.unsplash.com/photo-1571805529673-0f56b922b359?w=400&h=300&fit=crop', rating: 4.5, reviewCount: 189, deliveryTime: '15-25 min', minOrder: 12, distance: '1.6 km', categories: ['kebab', 'assiette'], hasOffer: false, hasDelivery: true, hasPickup: false },
  { id: '48', name: 'La Défense Express', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', rating: 4.3, reviewCount: 156, deliveryTime: '12-20 min', minOrder: 8, distance: '1.8 km', promo: 'Midi -20%', categories: ['sandwich', 'soup'], hasOffer: true, hasDelivery: true, hasPickup: true },
  { id: '49', name: 'Bezons Grill', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop', rating: 4.4, reviewCount: 134, deliveryTime: '25-38 min', minOrder: 13, distance: '2.2 km', categories: ['kebab', 'pide'], hasOffer: false, hasDelivery: true, hasPickup: true },
  { id: '50', name: 'Argenteuil Turkish', image: 'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=400&h=300&fit=crop', rating: 4.6, reviewCount: 245, deliveryTime: '28-42 min', minOrder: 15, distance: '2.5 km', promo: 'Nouveau', categories: ['assiette', 'lahmacun', 'desserts'], hasOffer: true, hasDelivery: true, hasPickup: true },
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
