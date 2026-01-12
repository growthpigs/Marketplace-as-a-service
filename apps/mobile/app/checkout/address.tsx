import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import { useCheckout, DeliveryAddress } from '@/context/CheckoutContext';

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
  const [showManualEntry, setShowManualEntry] = useState(false);

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

  // Use current location (placeholder - would use expo-location)
  const handleUseCurrentLocation = () => {
    // TODO: Implement with expo-location
    // For MVP, just show a placeholder address
    const mockAddress: DeliveryAddress = {
      formatted: 'Position actuelle',
      placeId: 'current_location',
      streetAddress: 'Position GPS',
      city: 'Paris',
      postalCode: '75001',
      coordinates: { lat: 48.8566, lng: 2.3522 },
    };
    setSelectedAddress(mockAddress);
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
        {/* Google Places Autocomplete */}
        <View style={styles.searchContainer}>
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
        </View>

        {/* Use Current Location */}
        <Pressable style={styles.locationButton} onPress={handleUseCurrentLocation}>
          <View style={styles.locationIconContainer}>
            <FontAwesome name="crosshairs" size={20} color="#000000" />
          </View>
          <Text style={styles.locationButtonText}>Utiliser ma position actuelle</Text>
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
});
