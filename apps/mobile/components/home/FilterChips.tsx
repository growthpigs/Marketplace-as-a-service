import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * FilterChips - Pixel-perfect copy of Uber Eats filter row
 *
 * UBER EATS DESIGN:
 * - Horizontal scroll
 * - Pill-shaped chips
 * - Icons + text
 * - Selected state: filled black
 *
 * CHIPS (French):
 * - TurkEats+ (premium membership)
 * - Retrait (pickup)
 * - Offres (deals)
 * - Livraison (delivery)
 */

interface FilterChip {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
}

const FILTER_CHIPS: FilterChip[] = [
  { id: 'turkeats-plus', label: 'TurkEats+', icon: 'bolt' },
  { id: 'pickup', label: 'Retrait', icon: 'shopping-bag' },
  { id: 'offers', label: 'Offres', icon: 'tag' },
  { id: 'delivery', label: 'Livraison', icon: 'motorcycle' },
];

interface FilterChipItemProps {
  chip: FilterChip;
  isSelected?: boolean;
  onPress?: () => void;
}

function FilterChipItem({ chip, isSelected, onPress }: FilterChipItemProps) {
  return (
    <Pressable
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
    >
      <FontAwesome
        name={chip.icon}
        size={14}
        color={isSelected ? '#FFFFFF' : '#000000'}
        style={styles.chipIcon}
      />
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {chip.label}
      </Text>
    </Pressable>
  );
}

interface FilterChipsProps {
  selectedFilters?: string[];
  onFilterPress?: (filterId: string) => void;
}

export function FilterChips({ selectedFilters = [], onFilterPress }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTER_CHIPS.map((chip) => (
        <FilterChipItem
          key={chip.id}
          chip={chip}
          isSelected={selectedFilters.includes(chip.id)}
          onPress={() => onFilterPress?.(chip.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  chipSelected: {
    backgroundColor: '#000000',
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});

export default FilterChips;
