import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

/**
 * TabLayout - Pixel-perfect copy of Uber Eats bottom navigation
 *
 * UBER EATS TABS:
 * 1. Home (house icon) - Main restaurant feed
 * 2. Grocery (shopping cart) - Grocery stores
 * 3. Browse (search/compass) - Category browsing
 * 4. Baskets (shopping bag) - Cart/orders
 * 5. Account (user icon) - Profile settings
 *
 * DESIGN TOKENS:
 * - Active: #000000 (black)
 * - Inactive: #6B7280 (gray)
 * - Icon size: 24px (Uber Eats uses SF Symbols ~24-28)
 * - Label size: 10px
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000', // Uber Eats uses black for active
        tabBarInactiveTintColor: '#6B7280', // Gray for inactive
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: 85,
          paddingTop: 8,
          paddingBottom: 25, // Safe area for iPhone home indicator
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="grocery"
        options={{
          title: 'Épicerie',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Parcourir',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="baskets"
        options={{
          title: 'Panier',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Compte',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      {/* Hide the old two.tsx route */}
      <Tabs.Screen
        name="two"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
