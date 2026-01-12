import { View, Text, StyleSheet } from 'react-native';

/**
 * MenuSection - Pixel-perfect copy of Uber Eats menu section header
 *
 * UBER EATS DESIGN:
 * - Section title (bold, 20px)
 * - Optional description
 * - Sticky header behavior (would need Animated for full implementation)
 *
 * LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ Les plus populaires                 │
 * └─────────────────────────────────────┘
 */

interface MenuSectionProps {
  title: string;
  description?: string;
}

export function MenuSection({ title, description }: MenuSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});

export default MenuSection;
