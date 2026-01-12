import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';

/**
 * CategoryRow - Pixel-perfect copy of Uber Eats category icons row
 *
 * UBER EATS DESIGN:
 * - Horizontal scroll
 * - Circular icons (60x60px)
 * - Category name below
 * - ~8px spacing between items
 *
 * TURKISH CATEGORIES:
 * 🥙 Assiette (plate)
 * 🥪 Sandwich (döner wrap)
 * 🍲 Soup
 * 🫓 Pide
 * 🍢 Kebab
 * 🧁 Desserts
 * ☕ Turkish Tea
 * 🫓 Lahmacun
 */

interface Category {
  id: string;
  name: string;
  emoji: string;
}

const TURKISH_CATEGORIES: Category[] = [
  { id: 'assiette', name: 'Assiette', emoji: '🥙' },
  { id: 'sandwich', name: 'Sandwich', emoji: '🥪' },
  { id: 'soup', name: 'Soupe', emoji: '🍲' },
  { id: 'pide', name: 'Pide', emoji: '🫓' },
  { id: 'kebab', name: 'Kebab', emoji: '🍢' },
  { id: 'desserts', name: 'Desserts', emoji: '🧁' },
  { id: 'tea', name: 'Thé', emoji: '☕' },
  { id: 'lahmacun', name: 'Lahmacun', emoji: '🫓' },
];

interface CategoryItemProps {
  category: Category;
  isSelected?: boolean;
  onPress?: () => void;
}

function CategoryItem({ category, isSelected, onPress }: CategoryItemProps) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
      <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={1}>
        {category.name}
      </Text>
    </Pressable>
  );
}

interface CategoryRowProps {
  selectedCategory?: string | null;
  onCategoryPress?: (categoryId: string) => void;
}

export function CategoryRow({ selectedCategory, onCategoryPress }: CategoryRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TURKISH_CATEGORIES.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isSelected={selectedCategory === category.id}
          onPress={() => onCategoryPress?.(category.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  item: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 64,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconContainerSelected: {
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#06C167',
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
  },
  nameSelected: {
    color: '#06C167',
    fontWeight: '700',
  },
});

export default CategoryRow;
