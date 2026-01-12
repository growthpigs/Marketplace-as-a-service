import { View, Text, StyleSheet, Pressable, ScrollView, Image, Alert, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';

interface Favorite {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
}

const MOCK_FAVORITES: Favorite[] = [
  {
    id: 1,
    name: 'Kebab Palace',
    image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd93549?w=400&h=300&fit=crop',
    rating: 4.5,
    deliveryTime: '15-25 min',
    cuisine: 'Turkish',
  },
  {
    id: 2,
    name: 'Le Roi du Döner',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561af1?w=400&h=300&fit=crop',
    rating: 4.6,
    deliveryTime: '18-28 min',
    cuisine: 'Turkish',
  },
  {
    id: 3,
    name: 'Assiette Grec',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    rating: 4.3,
    deliveryTime: '20-30 min',
    cuisine: 'Greek',
  },
];

export default function AccountScreen() {
  const [favorites, setFavorites] = useState<Favorite[]>(MOCK_FAVORITES);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter(f => f.id !== id));
    setMenuOpen(null);
    Alert.alert('Supprimé', 'Restaurant supprimé de vos favoris');
  };

  const handleShareFavorite = (name: string) => {
    Alert.alert('Partager', `Partager ${name} avec vos amis`);
    setMenuOpen(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <FontAwesome name="user" size={40} color="#FFFFFF" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Jean Dupont</Text>
          <Text style={styles.profileEmail}>jean.dupont@email.com</Text>
        </View>
      </View>

      {/* Favorites Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes Favoris ({favorites.length})</Text>
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <View key={fav.id} style={styles.favoriteCard}>
              <Image source={{ uri: fav.image }} style={styles.favoriteImage} />
              <View style={styles.favoriteInfo}>
                <View style={styles.favoriteHeader}>
                  <Text style={styles.favoriteName}>{fav.name}</Text>
                  <Pressable
                    style={styles.menuButton}
                    onPress={() => {
                      const newMenuOpen = menuOpen === fav.id ? null : fav.id;
                      setMenuOpen(newMenuOpen);
                    }}
                  >
                    <FontAwesome name="ellipsis-v" size={20} color="#6B7280" />
                  </Pressable>
                </View>
                <View style={styles.favoriteDetails}>
                  <View style={styles.detailBadge}>
                    <FontAwesome name="star" size={12} color="#FBBF24" />
                    <Text style={styles.rating}>{fav.rating}</Text>
                  </View>
                  <Text style={styles.meta}>{fav.cuisine} • {fav.deliveryTime}</Text>
                </View>

                {/* Ellipsis Menu */}
                {menuOpen === fav.id && (
                  <View style={styles.contextMenu}>
                    <Pressable
                      style={styles.menuItem}
                      onPress={() => handleShareFavorite(fav.name)}
                    >
                      <FontAwesome name="share-alt" size={16} color="#3B82F6" />
                      <Text style={styles.menuText}>Partager</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.menuItem, styles.menuItemDanger]}
                      onPress={() => handleRemoveFavorite(fav.id)}
                    >
                      <FontAwesome name="trash" size={16} color="#EF4444" />
                      <Text style={[styles.menuText, styles.menuTextDanger]}>Supprimer</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Aucun restaurant en favori</Text>
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        <Pressable style={styles.settingItem}>
          <FontAwesome name="cog" size={18} color="#6B7280" />
          <Text style={styles.settingText}>Paramètres du compte</Text>
          <FontAwesome name="chevron-right" size={16} color="#D1D5DB" />
        </Pressable>
        <Pressable style={styles.settingItem}>
          <FontAwesome name="bell" size={18} color="#6B7280" />
          <Text style={styles.settingText}>Notifications</Text>
          <FontAwesome name="chevron-right" size={16} color="#D1D5DB" />
        </Pressable>
        <Pressable style={[styles.settingItem, styles.settingItemDanger]}>
          <FontAwesome name="sign-out" size={18} color="#EF4444" />
          <Text style={[styles.settingText, styles.settingTextDanger]}>Se déconnecter</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  favoriteCard: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  favoriteImage: {
    width: '100%',
    height: 200,
  },
  favoriteInfo: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: -8,
    // Ensure web clickability
    ...(Platform.OS === 'web' && {
      pointerEvents: 'auto' as any,
    }),
  },
  favoriteDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
  },
  contextMenu: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 12,
  },
  menuItemDanger: {
    backgroundColor: '#FEE2E2',
  },
  menuText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  menuTextDanger: {
    color: '#EF4444',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 32,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  settingItemDanger: {
    borderBottomWidth: 0,
  },
  settingText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
    fontWeight: '500',
  },
  settingTextDanger: {
    color: '#EF4444',
  },
});
