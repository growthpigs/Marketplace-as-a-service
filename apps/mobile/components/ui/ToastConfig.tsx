import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BaseToast, ToastConfig } from 'react-native-toast-message';

/**
 * Uber Eats Style Toast Configuration
 *
 * Toast Types:
 * - success: Green checkmark, positive actions completed
 * - error: Red alert, actual system errors (network, server)
 * - info: Blue info, neutral information
 * - warning: Orange/yellow, validation messages & requirements
 *
 * Validation messages (like "Minimum €10") should use 'warning' type
 * Actual errors (like "Network error") should use 'error' type
 */

// Custom toast components for Uber Eats style
const SuccessToast = ({ text1, text2 }: { text1?: string; text2?: string }) => (
  <View style={[styles.toastContainer, styles.successToast]}>
    <View style={[styles.iconContainer, styles.successIcon]}>
      <FontAwesome name="check" size={16} color="#FFFFFF" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{text1}</Text>
      {text2 && <Text style={styles.subtitle}>{text2}</Text>}
    </View>
  </View>
);

const ErrorToast = ({ text1, text2 }: { text1?: string; text2?: string }) => (
  <View style={[styles.toastContainer, styles.errorToast]}>
    <View style={[styles.iconContainer, styles.errorIcon]}>
      <FontAwesome name="exclamation" size={16} color="#FFFFFF" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{text1}</Text>
      {text2 && <Text style={styles.subtitle}>{text2}</Text>}
    </View>
  </View>
);

const WarningToast = ({ text1, text2 }: { text1?: string; text2?: string }) => (
  <View style={[styles.toastContainer, styles.warningToast]}>
    <View style={[styles.iconContainer, styles.warningIcon]}>
      <FontAwesome name="info" size={16} color="#FFFFFF" />
    </View>
    <View style={styles.textContainer}>
      <Text style={[styles.title, styles.warningTitle]}>{text1}</Text>
      {text2 && <Text style={[styles.subtitle, styles.warningSubtitle]}>{text2}</Text>}
    </View>
  </View>
);

const InfoToast = ({ text1, text2 }: { text1?: string; text2?: string }) => (
  <View style={[styles.toastContainer, styles.infoToast]}>
    <View style={[styles.iconContainer, styles.infoIcon]}>
      <FontAwesome name="info-circle" size={16} color="#FFFFFF" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{text1}</Text>
      {text2 && <Text style={styles.subtitle}>{text2}</Text>}
    </View>
  </View>
);

// Toast configuration export
export const toastConfig: ToastConfig = {
  success: (props) => <SuccessToast text1={props.text1} text2={props.text2} />,
  error: (props) => <ErrorToast text1={props.text1} text2={props.text2} />,
  warning: (props) => <WarningToast text1={props.text1} text2={props.text2} />,
  info: (props) => <InfoToast text1={props.text1} text2={props.text2} />,
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 56,
  },
  // Toast type backgrounds
  successToast: {
    backgroundColor: '#000000',
  },
  errorToast: {
    backgroundColor: '#DC2626',
  },
  warningToast: {
    backgroundColor: '#FEF3C7', // Soft yellow like Uber Eats
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  infoToast: {
    backgroundColor: '#000000',
  },
  // Icon containers
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  successIcon: {
    backgroundColor: '#22C55E',
  },
  errorIcon: {
    backgroundColor: '#FFFFFF',
  },
  warningIcon: {
    backgroundColor: '#F59E0B',
  },
  infoIcon: {
    backgroundColor: '#3B82F6',
  },
  // Text styles
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  // Warning toast text (dark on light background)
  warningTitle: {
    color: '#000000',
  },
  warningSubtitle: {
    color: '#6B7280',
  },
});

export default toastConfig;
