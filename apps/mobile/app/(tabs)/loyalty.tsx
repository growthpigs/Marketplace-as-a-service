import { View, Text, StyleSheet, ScrollView, Pressable, Share, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';

/**
 * LoyaltyScreen - Wallet + Referral Program
 *
 * FEATURES (from MVP-PRD):
 * 1. US-C4 Cashback & Wallet:
 *    - View wallet balance
 *    - See cashback earned per order (10%)
 *    - Apply wallet balance to new orders
 *    - Request cash withdrawal (bank transfer)
 *    - View transaction history
 *
 * 2. US-C5 Affiliate Referral:
 *    - Generate personal referral QR code
 *    - Track referred users
 *    - Choose: 40% one-time or lifetime % commission
 *    - View earnings and payout history
 *
 * DESIGN:
 * ┌─────────────────────────────────────┐
 * │ Fidélité                            │
 * ├─────────────────────────────────────┤
 * │ ┌─────────────────────────────────┐ │
 * │ │ 💰 Mon Portefeuille             │ │
 * │ │ €24.50                          │ │
 * │ │ [Retirer]  [Historique]         │ │
 * │ └─────────────────────────────────┘ │
 * ├─────────────────────────────────────┤
 * │ 📊 Cashback Total: €156.80         │
 * │ 10% sur chaque commande            │
 * ├─────────────────────────────────────┤
 * │ 🎁 Parrainage                       │
 * │ ┌─────────────────────────────────┐ │
 * │ │ [QR CODE]     TURK-ABC123       │ │
 * │ │ Gagnez 40% sur la 1ère commande │ │
 * │ │ [Partager mon code]             │ │
 * │ └─────────────────────────────────┘ │
 * │ 3 amis parrainés • €45.00 gagnés   │
 * ├─────────────────────────────────────┤
 * │ Transactions récentes               │
 * │ ○ +€2.50 Cashback - Kebab Palace   │
 * │ ○ +€15.00 Parrainage - Marie       │
 * └─────────────────────────────────────┘
 */

type CommissionType = 'one-time' | 'lifetime';

// Mock user data
const MOCK_USER = {
  walletBalance: 24.50,
  totalCashback: 156.80,
  referralCode: 'TURK-ABC123',
  referredUsers: 3,
  referralEarnings: 45.00,
  commissionType: 'one-time' as CommissionType,
};

// Mock transactions
const MOCK_TRANSACTIONS = [
  { id: '1', type: 'cashback', amount: 2.50, description: 'Cashback - Kebab Palace', date: '12 jan.' },
  { id: '2', type: 'referral', amount: 15.00, description: 'Parrainage - Marie', date: '10 jan.' },
  { id: '3', type: 'cashback', amount: 1.80, description: 'Cashback - Istanbul Grill', date: '8 jan.' },
  { id: '4', type: 'withdrawal', amount: -50.00, description: 'Retrait bancaire', date: '5 jan.' },
  { id: '5', type: 'cashback', amount: 3.20, description: 'Cashback - Döner King', date: '3 jan.' },
];

export default function LoyaltyScreen() {
  const insets = useSafeAreaInsets();
  const [commissionType, setCommissionType] = useState<CommissionType>(MOCK_USER.commissionType);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🥙 Rejoins TurkEats et gagne 10% de cashback sur chaque commande!\n\nUtilise mon code: ${MOCK_USER.referralCode}\n\nTélécharge l'app: https://turkeats.app/r/${MOCK_USER.referralCode}`,
      });
    } catch (error) {
      // Handle error
    }
  };

  const handleWithdraw = () => {
    Alert.alert(
      'Retirer des fonds',
      `Souhaitez-vous retirer €${MOCK_USER.walletBalance.toFixed(2)} sur votre compte bancaire?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Retirer', onPress: () => Alert.alert('Succès', 'Votre demande de retrait a été envoyée.') },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fidélité</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <FontAwesome name="credit-card" size={20} color="#FFFFFF" />
            <Text style={styles.walletLabel}>Mon Portefeuille</Text>
          </View>
          <Text style={styles.walletBalance}>€{MOCK_USER.walletBalance.toFixed(2)}</Text>
          <View style={styles.walletActions}>
            <Pressable style={styles.walletButton} onPress={handleWithdraw}>
              <FontAwesome name="bank" size={14} color="#000000" />
              <Text style={styles.walletButtonText}>Retirer</Text>
            </Pressable>
            <Pressable style={styles.walletButtonOutline}>
              <FontAwesome name="history" size={14} color="#FFFFFF" />
              <Text style={styles.walletButtonTextOutline}>Historique</Text>
            </Pressable>
          </View>
        </View>

        {/* Cashback Summary */}
        <View style={styles.cashbackSection}>
          <View style={styles.cashbackHeader}>
            <FontAwesome name="percent" size={16} color="#22C55E" />
            <Text style={styles.cashbackTitle}>Cashback Total</Text>
          </View>
          <Text style={styles.cashbackAmount}>€{MOCK_USER.totalCashback.toFixed(2)}</Text>
          <Text style={styles.cashbackDescription}>
            10% de cashback sur chaque commande
          </Text>
        </View>

        {/* Referral Section */}
        <View style={styles.referralSection}>
          <View style={styles.referralHeader}>
            <FontAwesome name="gift" size={18} color="#000000" />
            <Text style={styles.referralTitle}>Programme de Parrainage</Text>
          </View>

          <View style={styles.referralCard}>
            {/* QR Code Placeholder */}
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCode}>
                <FontAwesome name="qrcode" size={80} color="#000000" />
              </View>
              <View style={styles.referralCodeContainer}>
                <Text style={styles.referralCodeLabel}>Ton code</Text>
                <Text style={styles.referralCode}>{MOCK_USER.referralCode}</Text>
              </View>
            </View>

            {/* Commission Type Toggle */}
            <View style={styles.commissionToggle}>
              <Pressable
                style={[
                  styles.commissionOption,
                  commissionType === 'one-time' && styles.commissionOptionActive,
                ]}
                onPress={() => setCommissionType('one-time')}
              >
                <Text style={[
                  styles.commissionOptionText,
                  commissionType === 'one-time' && styles.commissionOptionTextActive,
                ]}>
                  40% unique
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.commissionOption,
                  commissionType === 'lifetime' && styles.commissionOptionActive,
                ]}
                onPress={() => setCommissionType('lifetime')}
              >
                <Text style={[
                  styles.commissionOptionText,
                  commissionType === 'lifetime' && styles.commissionOptionTextActive,
                ]}>
                  10% à vie
                </Text>
              </Pressable>
            </View>

            <Text style={styles.commissionDescription}>
              {commissionType === 'one-time'
                ? 'Gagnez 40% de la première commande de chaque ami parrainé'
                : 'Gagnez 10% de toutes les commandes de vos amis, à vie!'
              }
            </Text>

            <Pressable style={styles.shareButton} onPress={handleShare}>
              <FontAwesome name="share" size={16} color="#FFFFFF" />
              <Text style={styles.shareButtonText}>Partager mon code</Text>
            </Pressable>
          </View>

          {/* Referral Stats */}
          <View style={styles.referralStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{MOCK_USER.referredUsers}</Text>
              <Text style={styles.statLabel}>Amis parrainés</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>€{MOCK_USER.referralEarnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Gains totaux</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.transactionsTitle}>Transactions récentes</Text>
          {MOCK_TRANSACTIONS.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <FontAwesome
                  name={
                    transaction.type === 'cashback' ? 'percent' :
                    transaction.type === 'referral' ? 'gift' : 'bank'
                  }
                  size={14}
                  color={transaction.amount >= 0 ? '#22C55E' : '#EF4444'}
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.amount >= 0 ? '#22C55E' : '#EF4444' }
              ]}>
                {transaction.amount >= 0 ? '+' : ''}€{Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Wallet Card
  walletCard: {
    backgroundColor: '#000000',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  walletBalance: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  walletButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  walletButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6B7280',
    gap: 8,
  },
  walletButtonTextOutline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Cashback Section
  cashbackSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cashbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cashbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  cashbackAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 4,
  },
  cashbackDescription: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Referral Section
  referralSection: {
    marginBottom: 16,
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 8,
  },
  referralCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  qrCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  qrCode: {
    width: 120,
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralCodeContainer: {
    flex: 1,
    marginLeft: 20,
  },
  referralCodeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  referralCode: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1,
  },
  commissionToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  commissionOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  commissionOptionActive: {
    backgroundColor: '#000000',
  },
  commissionOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  commissionOptionTextActive: {
    color: '#FFFFFF',
  },
  commissionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Referral Stats
  referralStats: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },

  // Transactions
  transactionsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
