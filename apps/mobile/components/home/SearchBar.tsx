import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * SearchBar - Pixel-perfect copy of Uber Eats search bar
 *
 * UBER EATS DESIGN:
 * - Gray background (#F3F4F6)
 * - Rounded corners (8px)
 * - Search icon on left
 * - Placeholder: "Search Uber Eats"
 * - Height: ~48px
 * - Horizontal padding: 16px
 */

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
}

export function SearchBar({ placeholder = "Rechercher TurkEats", onPress }: SearchBarProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <FontAwesome name="search" size={16} color="#6B7280" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        editable={!onPress} // If onPress is provided, make it a button
        pointerEvents={onPress ? 'none' : 'auto'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    marginHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
});

export default SearchBar;
