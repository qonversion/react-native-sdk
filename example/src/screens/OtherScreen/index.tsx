import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import Qonversion, { Entitlement, type PromoPurchasesListener } from '@qonversion/react-native-sdk';
import { AppContext } from '../../store/AppStore';
import SkeletonLoader from '../../components/SkeletonLoader';
import styles from './styles';
import Snackbar from 'react-native-snackbar';

const OtherScreen: React.FC = () => {
  const context = React.useContext(AppContext);
  if (!context) return null;
  const { state, dispatch } = context;

  const [fallbackAccessible, setFallbackAccessible] = useState<boolean | null>(
    null
  );

  const checkFallbackFile = async () => {
    try {
      console.log(
        '🔄 [Qonversion] Starting isFallbackFileAccessible() call...'
      );
      dispatch({ type: 'SET_LOADING', payload: true });
      const accessible =
        await Qonversion.getSharedInstance().isFallbackFileAccessible();
      console.log(
        '✅ [Qonversion] isFallbackFileAccessible() call successful:',
        accessible
      );
      setFallbackAccessible(accessible);
    } catch (error: any) {
      console.error(
        '❌ [Qonversion] isFallbackFileAccessible() call failed:',
        error
      );
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const collectAdvertisingId = () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Error', 'This method is iOS only');
      return;
    }
    try {
      console.log('🔄 [Qonversion] Starting collectAdvertisingId() call...');
      Qonversion.getSharedInstance().collectAdvertisingId();
      console.log('✅ [Qonversion] collectAdvertisingId() call successful');
      Snackbar.show({
        text: 'Advertising ID collected!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error(
        '❌ [Qonversion] collectAdvertisingId() call failed:',
        error
      );
      Alert.alert('Error', error.message);
    }
  };

  const collectAppleSearchAdsAttribution = () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Error', 'This method is iOS only');
      return;
    }
    try {
      console.log(
        '🔄 [Qonversion] Starting collectAppleSearchAdsAttribution() call...'
      );
      Qonversion.getSharedInstance().collectAppleSearchAdsAttribution();
      console.log(
        '✅ [Qonversion] collectAppleSearchAdsAttribution() call successful'
      );
      Snackbar.show({
        text: 'Apple Search Ads attribution collected!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error(
        '❌ [Qonversion] collectAppleSearchAdsAttribution() call failed:',
        error
      );
      Alert.alert('Error', error.message);
    }
  };

  const presentCodeRedemptionSheet = () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Error', 'This method is iOS only');
      return;
    }
    try {
      console.log(
        '🔄 [Qonversion] Starting presentCodeRedemptionSheet() call...'
      );
      Qonversion.getSharedInstance().presentCodeRedemptionSheet();
      console.log(
        '✅ [Qonversion] presentCodeRedemptionSheet() call successful'
      );
      Snackbar.show({
        text: 'Code redemption sheet presented!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error(
        '❌ [Qonversion] presentCodeRedemptionSheet() call failed:',
        error
      );
      Alert.alert('Error', error.message);
    }
  };

  const setPromoPurchasesDelegate = () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Error', 'This method is iOS only');
      return;
    }
    try {
      console.log(
        '🔄 [Qonversion] Starting setPromoPurchasesDelegate() call...'
      );
      
      const promoPurchasesListener: PromoPurchasesListener = {
        onPromoPurchaseReceived: (productId: string, promoPurchaseExecutor: () => Promise<Map<string, Entitlement>>) => {
          console.log('🎁 [PromoPurchasesListener] onPromoPurchaseReceived:', {
            productId,
          });

          promoPurchaseExecutor().then(entitlements => {
            console.log('✅ [PromoPurchasesListener] promo purchase executed:', Object.fromEntries(entitlements));
          }).catch(error => {
            console.error('❌ [PromoPurchasesListener] promo purchase failed:', error);
          });
        },
      };
      
      Qonversion.getSharedInstance().setPromoPurchasesDelegate(promoPurchasesListener);
      console.log(
        '✅ [Qonversion] setPromoPurchasesDelegate() call successful'
      );
      Snackbar.show({
        text: 'Promo purchases delegate set!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error(
        '❌ [Qonversion] setPromoPurchasesDelegate() call failed:',
        error
      );
      Alert.alert('Error', error.message);
    }
  };

  if (state.loading) {
    return <SkeletonLoader />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <TouchableOpacity style={styles.button} onPress={checkFallbackFile}>
        <Text style={styles.buttonText}>Check Fallback File Accessibility</Text>
      </TouchableOpacity>

      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorLabel}>Accessibility:</Text>
        <View
          style={[
            styles.indicator,
            fallbackAccessible === null && styles.indicatorGray,
            fallbackAccessible === true && styles.indicatorGreen,
            fallbackAccessible === false && styles.indicatorRed,
          ]}
        />
      </View>

      <View style={styles.iosOnlyContainer}>
        <Text style={styles.sectionTitle}>iOS Only Methods:</Text>
        <TouchableOpacity style={styles.button} onPress={collectAdvertisingId}>
          <Text style={styles.buttonText}>Collect Advertising ID</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={collectAppleSearchAdsAttribution}
        >
          <Text style={styles.buttonText}>
            Collect Apple Search Ads Attribution
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={presentCodeRedemptionSheet}
        >
          <Text style={styles.buttonText}>Present Code Redemption Sheet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={setPromoPurchasesDelegate}
        >
          <Text style={styles.buttonText}>Set Promo Purchases Delegate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OtherScreen;
