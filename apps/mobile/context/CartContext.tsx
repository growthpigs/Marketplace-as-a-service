import React, { createContext, useContext, useReducer, useMemo } from 'react';

/**
 * CartContext - Global cart state management
 *
 * UBER EATS CART BEHAVIOR:
 * - Single restaurant per cart (clear warning if switching)
 * - Item quantities adjustable
 * - Running total calculation
 * - Delivery fee + service fee calculations
 * - Minimum order enforcement
 *
 * STRUCTURE:
 * - CartItem: { menuItem, quantity, notes }
 * - Cart: { restaurantId, restaurantName, items[], fees }
 */

// Types
export interface CartMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
}

export interface CartItem {
  menuItem: CartMenuItem;
  quantity: number;
  notes?: string;
}

export interface CartState {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  deliveryFee: number;
  serviceFee: number;
  minOrder: number;
}

// Action Types
type CartAction =
  | { type: 'ADD_ITEM'; payload: { restaurantId: string; restaurantName: string; menuItem: CartMenuItem; minOrder?: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_RESTAURANT'; payload: { restaurantId: string; restaurantName: string; minOrder: number } };

// Initial State
const initialState: CartState = {
  restaurantId: null,
  restaurantName: null,
  items: [],
  deliveryFee: 0.49, // Default €0.49 delivery fee
  serviceFee: 0, // 2% service fee calculated on subtotal
  minOrder: 10, // Default €10 minimum
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { restaurantId, restaurantName, menuItem, minOrder } = action.payload;

      // If cart has items from different restaurant, we'd normally show a warning
      // For now, we'll clear and start fresh (could add confirmation modal later)
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          ...initialState,
          restaurantId,
          restaurantName,
          minOrder: minOrder ?? 10,
          items: [{ menuItem, quantity: 1 }],
        };
      }

      // Check if item already exists in cart
      const existingIndex = state.items.findIndex(
        (item) => item.menuItem.id === menuItem.id
      );

      if (existingIndex >= 0) {
        // Increment quantity
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return { ...state, items: newItems };
      }

      // Add new item
      return {
        ...state,
        restaurantId,
        restaurantName,
        minOrder: minOrder ?? state.minOrder,
        items: [...state.items, { menuItem, quantity: 1 }],
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        (item) => item.menuItem.id !== action.payload.itemId
      );

      // If cart is empty, reset restaurant
      if (newItems.length === 0) {
        return initialState;
      }

      return { ...state, items: newItems };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;

      // If quantity is 0 or less, remove item
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { itemId } });
      }

      const newItems = state.items.map((item) =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      );

      return { ...state, items: newItems };
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    case 'SET_RESTAURANT': {
      return {
        ...state,
        restaurantId: action.payload.restaurantId,
        restaurantName: action.payload.restaurantName,
        minOrder: action.payload.minOrder,
      };
    }

    default:
      return state;
  }
}

// Context Types
interface CartContextValue {
  state: CartState;
  // Actions
  addItem: (restaurantId: string, restaurantName: string, menuItem: CartMenuItem, minOrder?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  // Computed values
  itemCount: number;
  subtotal: number;
  total: number;
  meetsMinOrder: boolean;
}

// Create Context
const CartContext = createContext<CartContextValue | undefined>(undefined);

// Provider Component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Actions
  const addItem = (
    restaurantId: string,
    restaurantName: string,
    menuItem: CartMenuItem,
    minOrder?: number
  ) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { restaurantId, restaurantName, menuItem, minOrder },
    });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Computed values (memoized)
  const computedValues = useMemo(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    // Service fee is 2% of subtotal (like Uber Eats)
    const serviceFee = subtotal * 0.02;
    const total = subtotal + state.deliveryFee + serviceFee;
    const meetsMinOrder = subtotal >= state.minOrder;

    return { itemCount, subtotal, total, meetsMinOrder };
  }, [state.items, state.deliveryFee, state.minOrder]);

  const value: CartContextValue = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    ...computedValues,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook for consuming cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
