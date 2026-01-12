import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useCart } from '@/context/CartContext';

/**
 * BasketsScreen (Cart) - Pixel-perfect copy of Uber Eats cart
 *
 * UBER EATS CART LAYOUT:
 * 1. Header with restaurant name
 * 2. Cart items with quantity controls
 * 3. Price breakdown (subtotal, delivery, service fee)
 * 4. Checkout button
 *
 * LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ Panier                              │
 * ├─────────────────────────────────────┤
 * │ Kebab Palace                     → │
 * ├─────────────────────────────────────┤
 * │ [-] 2 [+] Döner Sandwich    €15.00 │
 * │ [-] 1 [+] Assiette Grec     €12.90 │
 * ├─────────────────────────────────────┤
 * │ Sous-total              €27.90     │
 * │ Frais de livraison      €0.49      │
 * │ Frais de service        €0.56      │
 * │ ─────────────────────────────────── │
 * │ Total                   €28.95     │
 * ├─────────────────────────────────────┤
 * │ [    Passer la commande    ]       │
 * └─────────────────────────────────────┘
 */

// Empty Cart Component
function EmptyCart() {
  const router = useRouter();

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <FontAwesome name="shopping-bag" size={60} color="#E5E7EB" />
      </View>
      <Text style={styles.emptyTitle}>Votre panier est vide</Text>
      <Text style={styles.emptySubtitle}>
        Ajoutez des articles d'un restaurant pour commencer votre commande
      </Text>
      <Pressable
        style={styles.browseButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.browseButtonText}>Parcourir les restaurants</Text>
      </Pressable>
    </View>
  );
}

// Cart Item Component
interface CartItemRowProps {
  item: {
    menuItem: {
      id: string;
      name: string;
      price: number;
      image: string | null;
    };
    quantity: number;
  };
  onIncrement: () => void;
  onDecrement: () => void;
}

function CartItemRow({ item, onIncrement, onDecrement }: CartItemRowProps) {
  const totalPrice = item.menuItem.price * item.quantity;

  return (
    <View style={styles.cartItem}>
      {/* Quantity Controls */}
      <View style={styles.quantityControls}>
        <Pressable
          style={styles.quantityButton}
          onPress={onDecrement}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome
            name={item.quantity === 1 ? 'trash-o' : 'minus'}
            size={14}
            color="#000000"
          />
        </Pressable>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Pressable
          style={styles.quantityButton}
          onPress={onIncrement}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="plus" size={14} color="#000000" />
        </Pressable>
      </View>

      {/* Item Name */}
      <Text style={styles.itemName} numberOfLines={2}>
        {item.menuItem.name}
      </Text>

      {/* Price */}
      <Text style={styles.itemPrice}>€{totalPrice.toFixed(2)}</Text>
    </View>
  );
}

export default function BasketsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    state,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    total,
    meetsMinOrder,
  } = useCart();

  // Show empty state if no items
  if (state.items.length === 0) {
    return <EmptyCart />;
  }

  // Calculate fees
  const deliveryFee = state.deliveryFee;
  const serviceFee = subtotal * 0.02; // 2% service fee

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panier</Text>
        <Pressable onPress={clearCart}>
          <Text style={styles.clearButton}>Vider</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <Pressable
          style={styles.restaurantRow}
          onPress={() => router.push(`/restaurant/${state.restaurantId}`)}
        >
          <Text style={styles.restaurantName}>{state.restaurantName}</Text>
          <FontAwesome name="chevron-right" size={14} color="#6B7280" />
        </Pressable>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Cart Items */}
        {state.items.map((item) => (
          <CartItemRow
            key={item.menuItem.id}
            item={item}
            onIncrement={() =>
              updateQuantity(item.menuItem.id, item.quantity + 1)
            }
            onDecrement={() =>
              updateQuantity(item.menuItem.id, item.quantity - 1)
            }
          />
        ))}

        {/* Price Breakdown */}
        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Sous-total</Text>
            <Text style={styles.priceValue}>€{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Frais de livraison</Text>
            <Text style={styles.priceValue}>€{deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Frais de service</Text>
            <Text style={styles.priceValue}>€{serviceFee.toFixed(2)}</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>€{total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Minimum Order Warning */}
        {!meetsMinOrder && (
          <View style={styles.warningContainer}>
            <FontAwesome name="info-circle" size={16} color="#F59E0B" />
            <Text style={styles.warningText}>
              Commande minimum: €{state.minOrder.toFixed(2)} (il vous manque €
              {(state.minOrder - subtotal).toFixed(2)})
            </Text>
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={[styles.checkoutContainer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[
            styles.checkoutButton,
            !meetsMinOrder && styles.checkoutButtonDisabled,
          ]}
          disabled={!meetsMinOrder}
          onPress={() => console.log('Checkout pressed')}
        >
          <Text style={styles.checkoutButtonText}>
            Passer la commande • €{total.toFixed(2)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  scrollView: {
    flex: 1,
  },
  restaurantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  divider: {
    height: 8,
    backgroundColor: '#F3F4F6',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    marginRight: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  priceBreakdown: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
  },
  checkoutContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  checkoutButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
