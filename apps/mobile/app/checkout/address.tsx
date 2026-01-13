import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
// GooglePlacesAutocomplete crashes on web - only import for native
import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { useCheckout, DeliveryAddress } from '@/context/CheckoutContext';

const isWeb = Platform.OS === 'web';

/**
 * AddressScreen - Delivery address selection
 *
 * UBER EATS ADDRESS SCREEN LAYOUT:
 * ┌─────────────────────────────────────┐
 * │ ← Adresse de livraison              │
 * ├─────────────────────────────────────┤
 * │ 🔍 [Rechercher une adresse...    ]  │
 * ├─────────────────────────────────────┤
 * │ 📍 Utiliser ma position actuelle    │
 * ├─────────────────────────────────────┤
 * │ Adresses récentes                   │
 * │ ○ 12 rue de la Paix, Paris         │
 * │ ○ 5 avenue des Champs-Élysées      │
 * ├─────────────────────────────────────┤
 * │ Instructions de livraison           │
 * │ [Code, étage, etc.              ]   │
 * ├─────────────────────────────────────┤
 * │ [       Confirmer l'adresse      ]  │
 * └─────────────────────────────────────┘
 */

// Get Google Maps credential from environment
const googleMapsCredential = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function AddressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state, setAddress } = useCheckout();

  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(
    state.deliveryAddress
  );
  const [instructions, setInstructions] = useState(
    state.deliveryAddress?.instructions || ''
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [webAddressInput, setWebAddressInput] = useState('');

  // Web fallback: handle manual address entry
  const handleWebAddressSubmit = () => {
    if (!webAddressInput.trim()) return;

    const address: DeliveryAddress = {
      formatted: webAddressInput.trim(),
      placeId: 'web_manual_entry',
      streetAddress: webAddressInput.trim(),
      city: 'France',
      postalCode: '',
      coordinates: { lat: 48.8566, lng: 2.3522 }, // Default to Paris for demo
    };
    setSelectedAddress(address);
  };

  // Handle place selection from autocomplete
  const handlePlaceSelect = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
    if (!details) return;

    // Extract address components
    let streetNumber = '';
    let streetName = '';
    let city = '';
    let postalCode = '';

    details.address_components?.forEach((component) => {
      if (component.types.includes('street_number')) {
        streetNumber = component.long_name;
      }
      if (component.types.includes('route')) {
        streetName = component.long_name;
      }
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    });

    const address: DeliveryAddress = {
      formatted: details.formatted_address || data.description,
      placeId: data.place_id,
      streetAddress: streetNumber ? `${streetNumber} ${streetName}` : streetName,
      city,
      postalCode,
      coordinates: {
        lat: details.geometry?.location?.lat || 0,
        lng: details.geometry?.location?.lng || 0,
      },
    };

    setSelectedAddress(address);
  };

  // Handle confirm address
  const handleConfirm = () => {
    if (!selectedAddress) return;

    // Add instructions to address
    const addressWithInstructions: DeliveryAddress = {
      ...selectedAddress,
      instructions: instructions.trim() || undefined,
    };

    setAddress(addressWithInstructions);
    router.push('/checkout/delivery-time');
  };

  // Use current location with real GPS (native) or demo location (web)
  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true);

    try {
      // Web fallback: use default Paris location
      if (isWeb) {
        const address: DeliveryAddress = {
          formatted: '123 Rue de la République, 75010 Paris, France',
          placeId: 'web_demo_location',
          streetAddress: '123 Rue de la République',
          city: 'Paris',
          postalCode: '75010',
          coordinates: { lat: 48.8693, lng: 2.3635 },
        };
        setSelectedAddress(address);
        setIsLoadingLocation(false);
        return;
      }

      // Native: Request real GPS permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Activez la localisation dans les paramètres pour utiliser cette fonctionnalité.'
        );
        setIsLoadingLocation(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode using Google Maps API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsCredential}&language=fr`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];

        // Extract address components
        let streetNumber = '';
        let streetName = '';
        let city = '';
        let postalCode = '';

        result.address_components?.forEach((component: any) => {
          if (component.types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (component.types.includes('route')) {
            streetName = component.long_name;
          }
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });

        const address: DeliveryAddress = {
          formatted: result.formatted_address,
          placeId: result.place_id,
          streetAddress: streetNumber ? `${streetNumber} ${streetName}` : streetName,
          city,
          postalCode,
          coordinates: { lat: latitude, lng: longitude },
        };

        setSelectedAddress(address);
      } else {
        // Fallback if geocoding fails
        const address: DeliveryAddress = {
          formatted: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          placeId: 'current_location',
          streetAddress: 'Position GPS',
          city: '',
          postalCode: '',
          coordinates: { lat: latitude, lng: longitude },
        };
        setSelectedAddress(address);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Erreur de localisation',
        'Impossible de récupérer votre position. Veuillez réessayer.'
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Address Input - Platform conditional */}
        <View style={styles.searchContainer}>
          {isWeb ? (
            /* Web fallback: Simple TextInput (GooglePlacesAutocomplete crashes on web) */
            <View style={styles.webInputContainer}>
              <TextInput
                style={styles.webAddressInput}
                placeholder="Entrez votre adresse..."
                placeholderTextColor="#9CA3AF"
                value={webAddressInput}
                onChangeText={setWebAddressInput}
                onSubmitEditing={handleWebAddressSubmit}
                returnKeyType="done"
              />
              <Pressable style={styles.webSubmitButton} onPress={handleWebAddressSubmit}>
                <FontAwesome name="check" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : (
            /* Native: Full Google Places Autocomplete */
            <GooglePlacesAutocomplete
              placeholder="Rechercher une adresse..."
              onPress={handlePlaceSelect}
              fetchDetails={true}
              query={{
                key: googleMapsCredential,
                language: 'fr',
                components: 'country:fr', // Restrict to France
              }}
              styles={{
                container: {
                  flex: 0,
                },
                textInputContainer: {
                  backgroundColor: '#F3F4F6',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                },
                textInput: {
                  height: 48,
                  color: '#000000',
                  fontSize: 16,
                  backgroundColor: 'transparent',
                },
                listView: {
                  backgroundColor: '#FFFFFF',
                  borderRadius: 8,
                  marginTop: 4,
                  elevation: 3,
                  // iOS shadow properties (deprecated but iOS-specific)
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                },
                row: {
                  backgroundColor: '#FFFFFF',
                  padding: 16,
                },
                description: {
                  fontSize: 14,
                  color: '#000000',
                },
                separator: {
                  height: 1,
                  backgroundColor: '#E5E7EB',
                },
              }}
              enablePoweredByContainer={false}
              debounce={300}
              minLength={3}
              nearbyPlacesAPI="GooglePlacesSearch"
            />
          )}
        </View>

        {/* Use Current Location */}
        <Pressable
          style={[styles.locationButton, isLoadingLocation && styles.locationButtonLoading]}
          onPress={handleUseCurrentLocation}
          disabled={isLoadingLocation}
        >
          <View style={styles.locationIconContainer}>
            {isLoadingLocation ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <FontAwesome name="crosshairs" size={20} color="#000000" />
            )}
          </View>
          <Text style={styles.locationButtonText}>
            {isLoadingLocation ? 'Localisation en cours...' : 'Utiliser ma position actuelle'}
          </Text>
        </Pressable>

        {/* Selected Address Display */}
        {selectedAddress && (
          <View style={styles.selectedAddressContainer}>
            <View style={styles.selectedAddressHeader}>
              <FontAwesome name="map-marker" size={20} color="#22C55E" />
              <Text style={styles.selectedAddressLabel}>Adresse sélectionnée</Text>
            </View>
            <Text style={styles.selectedAddressText}>{selectedAddress.formatted}</Text>
            {selectedAddress.city && selectedAddress.postalCode && (
              <Text style={styles.selectedAddressDetail}>
                {selectedAddress.postalCode} {selectedAddress.city}
              </Text>
            )}
          </View>
        )}

        {/* Delivery Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsLabel}>
            Instructions de livraison (optionnel)
          </Text>
          <TextInput
            style={styles.instructionsInput}
            placeholder="Code d'entrée, étage, nom sur l'interphone..."
            placeholderTextColor="#9CA3AF"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[
            styles.confirmButton,
            !selectedAddress && styles.confirmButtonDisabled,
          ]}
          disabled={!selectedAddress}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirmer l'adresse</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  searchContainer: {
    zIndex: 10,
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  locationButtonLoading: {
    opacity: 0.7,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  selectedAddressContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  selectedAddressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedAddressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
    marginLeft: 8,
  },
  selectedAddressText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
  },
  selectedAddressDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  instructionsContainer: {
    marginBottom: 16,
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  instructionsInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
    minHeight: 80,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Web fallback styles
  webInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webAddressInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
  },
  webSubmitButton: {
    backgroundColor: '#000000',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
