import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

// NativeWind CSS import
import '../global.css';

import { useColorScheme } from '@/components/useColorScheme';
import { LaunchScreen } from '@/components/screens/LaunchScreen';
import { CartProvider } from '@/context/CartContext';
import { toastConfig } from '@/components/ui/ToastConfig';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const [showLaunch, setShowLaunch] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Show branded launch screen for 1.5 seconds (like Uber Eats)
      const timer = setTimeout(() => {
        setShowLaunch(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  // Show branded launch screen while loading or during launch animation
  if (!loaded || showLaunch) {
    return <LaunchScreen />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <CartProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <Toast config={toastConfig} position="top" topOffset={60} />
      </ThemeProvider>
    </CartProvider>
  );
}
