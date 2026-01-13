import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

/**
 * TabLayout - TurkEats bottom navigation
 *
 * TURKEATS TABS:
 * 1. Home (house icon) - Main restaurant feed
 * 2. Loyalty (star icon) - Wallet + Referral program
 * 3. Browse (search/compass) - Category browsing
 * 4. Account (user icon) - Profile settings
 *
 * DESIGN TOKENS:
 * - Active: #000000 (black)
 * - Inactive: #6B7280 (gray)
 * - Icon size: 24px
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
        name="loyalty"
        options={{
          title: 'Fidélité',
          tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
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
        name="account"
        options={{
          title: 'Compte',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
