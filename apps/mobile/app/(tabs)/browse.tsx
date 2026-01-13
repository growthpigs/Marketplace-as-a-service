import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

// Map collection IDs to filter actions
const COLLECTION_FILTERS: Record<string, { filter?: string; message: string }> = {
  popular: { message: 'Affichage des restaurants les mieux notés' },
  new: { message: 'Affichage des nouveaux restaurants' },
  rated: { message: 'Affichage des restaurants avec note 4.6+' },
  deals: { filter: 'offres', message: 'Affichage des restaurants avec offres' },
  quick: { message: 'Affichage des restaurants avec livraison < 20 min' },
  delivery: { filter: 'livraison', message: 'Affichage des restaurants avec livraison gratuite' },
};

// Map category names to category IDs used in home
const CATEGORY_MAP: Record<string, string> = {
  'Kebab': 'kebab',
  'Sandwich': 'sandwich',
  'Pide': 'pide',
  'Assiette': 'assiette',
  'Lahmacun': 'lahmacun',
  'Soupe': 'soup',
};

interface Collection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  count: number;
}

const COLLECTIONS: Collection[] = [
  {
    id: 'popular',
    title: 'Les Plus Populaires',
    subtitle: '15 restaurants • Classés par votes',
    icon: 'fire',
    color: '#FF6B35',
    count: 15,
  },
  {
    id: 'new',
    title: 'Nouveautés',
    subtitle: '8 restaurants • Récemment ouverts',
    icon: 'star',
    color: '#FFD60A',
    count: 8,
  },
  {
    id: 'rated',
    title: 'Meilleure Note',
    subtitle: '12 restaurants • Évaluation 4.6+',
    icon: 'heart',
    color: '#E63946',
    count: 12,
  },
  {
    id: 'deals',
    title: 'Meilleures Offres',
    subtitle: '18 restaurants • Réductions actives',
    icon: 'tag',
    color: '#06A77D',
    count: 18,
  },
  {
    id: 'quick',
    title: 'Livraison Rapide',
    subtitle: '22 restaurants • < 20 min',
    icon: 'bolt',
    color: '#0066FF',
    count: 22,
  },
  {
    id: 'delivery',
    title: 'Livraison Gratuite',
    subtitle: '14 restaurants • Sans frais',
    icon: 'truck',
    color: '#7209B7',
    count: 14,
  },
];

const CATEGORIES = [
  { name: 'Kebab', icon: '🌮', count: 6 },
  { name: 'Sandwich', icon: '🥪', count: 5 },
  { name: 'Pide', icon: '🥟', count: 5 },
  { name: 'Assiette', icon: '🍽️', count: 5 },
  { name: 'Lahmacun', icon: '🔥', count: 4 },
  { name: 'Soupe', icon: '🍲', count: 4 },
];

export default function BrowseScreen() {
  const router = useRouter();

  // Handle collection press - navigate to home with filter
  const handleCollectionPress = (collectionId: string) => {
    const config = COLLECTION_FILTERS[collectionId];
    if (config) {
      // Navigate to home tab with filter param
      router.push({
        pathname: '/',
        params: { collection: collectionId },
      });
    }
  };

  // Handle category press - navigate to home with category filter
  const handleCategoryPress = (categoryName: string) => {
    const categoryId = CATEGORY_MAP[categoryName];
    if (categoryId) {
      router.push({
        pathname: '/',
        params: { category: categoryId },
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Parcourir</Text>
        <Text style={styles.subtitle}>Découvrez nos restaurants</Text>
      </View>

      {/* Collections Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collections Spéciales</Text>
        {COLLECTIONS.map((collection) => (
          <Pressable
            key={collection.id}
            style={styles.collectionCard}
            onPress={() => handleCollectionPress(collection.id)}
          >
            <View
              style={[styles.collectionIcon, { backgroundColor: collection.color }]}
            >
              <FontAwesome name={collection.icon as any} size={20} color="#FFFFFF" />
            </View>
            <View style={styles.collectionInfo}>
              <Text style={styles.collectionTitle}>{collection.title}</Text>
              <Text style={styles.collectionSubtitle}>{collection.subtitle}</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#D1D5DB" />
          </Pressable>
        ))}
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Par Type de Cuisine</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category, index) => (
            <Pressable
              key={index}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category.name)}
            >
              <Text style={styles.categoryEmoji}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 8,
  },
  collectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  collectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  bottomSpacer: {
    height: 80,
  },
});
