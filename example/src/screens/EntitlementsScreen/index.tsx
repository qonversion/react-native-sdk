import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import Qonversion, { PurchaseResult } from '@qonversion/react-native-sdk';
import Snackbar from 'react-native-snackbar';
import { AppContext } from '../../store/AppStore';
import SkeletonLoader from '../../components/SkeletonLoader';
import styles from './styles';

const EntitlementsScreen: React.FC = () => {
  const context = React.useContext(AppContext);
  if (!context) return null;
  const { state, dispatch } = context;

  const loadEntitlements = async () => {
    try {
      console.log('🔄 [Qonversion] Starting checkEntitlements() call...');
      dispatch({ type: 'SET_LOADING', payload: true });
      const entitlements =
        await Qonversion.getSharedInstance().checkEntitlements();
      console.log(
        '✅ [Qonversion] checkEntitlements() call successful:',
        Object.fromEntries(entitlements)
      );
      dispatch({ type: 'SET_ENTITLEMENTS', payload: entitlements });
    } catch (error: any) {
      console.error('❌ [Qonversion] checkEntitlements() call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setDeferredPurchasesListener = () => {
    console.log('🔄 [Qonversion] Setting deferred purchases listener...');
    Qonversion.getSharedInstance().setDeferredPurchasesListener({
      onDeferredPurchaseCompleted(purchaseResult: PurchaseResult) {
        console.log(
          '📡 [Qonversion] Deferred purchase completed via listener:',
          purchaseResult
        );
        if (purchaseResult.entitlements) {
          dispatch({
            type: 'SET_ENTITLEMENTS',
            payload: purchaseResult.entitlements,
          });
        }
      },
    });
    console.log(
      '✅ [Qonversion] Deferred purchases listener set successfully'
    );
    Snackbar.show({
      text: 'Deferred purchases listener set successfully!',
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const restore = async () => {
    try {
      console.log('🔄 [Qonversion] Starting restore() call...');
      dispatch({ type: 'SET_LOADING', payload: true });
      const entitlements = await Qonversion.getSharedInstance().restore();
      console.log('✅ [Qonversion] restore() call successful:', Object.fromEntries(entitlements));
      dispatch({ type: 'SET_ENTITLEMENTS', payload: entitlements });
      Snackbar.show({
        text: 'Purchases restored successfully!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [Qonversion] restore() call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const syncHistoricalData = async () => {
    try {
      console.log('🔄 [Qonversion] Starting syncHistoricalData() call...');
      dispatch({ type: 'SET_LOADING', payload: true });
      Qonversion.getSharedInstance().syncHistoricalData();
      console.log('✅ [Qonversion] syncHistoricalData() call successful');
      Snackbar.show({
        text: 'Historical data synced successfully!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [Qonversion] syncHistoricalData() call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const syncStoreKit2Purchases = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Error', 'This method is iOS only');
      return;
    }
    try {
      Qonversion.getSharedInstance().syncStoreKit2Purchases();
      Snackbar.show({
        text: 'StoreKit 2 purchases synced!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const syncPurchases = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('Error', 'This method is Android only');
      return;
    }
    try {
      Qonversion.getSharedInstance().syncPurchases();
      Snackbar.show({
        text: 'Purchases synced!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity style={styles.button} onPress={loadEntitlements}>
          <Text style={styles.buttonText}>Load Entitlements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={setDeferredPurchasesListener}
        >
          <Text style={styles.buttonText}>
            Set Deferred Purchases Listener
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={restore}>
          <Text style={styles.buttonText}>Restore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={syncHistoricalData}>
          <Text style={styles.buttonText}>Sync Historical Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={syncStoreKit2Purchases}
        >
          <Text style={styles.buttonText}>
            Sync StoreKit 2 Purchases (iOS Only)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={syncPurchases}>
          <Text style={styles.buttonText}>Sync Purchases (Android Only)</Text>
        </TouchableOpacity>

        {/* Entitlements Status Section */}
        <View style={styles.statusContainer}>
          {state.loading ? (
            // Loading state - show skeleton only for entitlements section
            <View style={styles.listContainer}>
              <Text style={styles.sectionTitle}>Your Entitlements</Text>
              <SkeletonLoader />
            </View>
          ) : state.entitlements === null ? (
            // Not loaded state
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateTitle}>No Entitlements Loaded</Text>
              <Text style={styles.emptyStateText}>
                Tap "Load Entitlements" to fetch your current entitlements from
                the server.
              </Text>
            </View>
          ) : state.entitlements.size === 0 ? (
            // Empty entitlements state
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateTitle}>No Entitlements Found</Text>
              <Text style={styles.emptyStateText}>
                You don't have any active entitlements. Try restoring purchases
                or check your subscription status.
              </Text>
            </View>
          ) : (
            // Entitlements list
            <View style={styles.listContainer}>
              <Text style={styles.sectionTitle}>Your Entitlements</Text>
              {Array.from(state.entitlements.entries()).map(
                ([id, entitlement]) => (
                  <TouchableOpacity
                    key={id}
                    style={styles.listItem}
                    onPress={() => {
                      dispatch({
                        type: 'SET_SELECTED_ENTITLEMENT',
                        payload: entitlement,
                      });
                      dispatch({
                        type: 'PUSH_SCREEN',
                        payload: 'entitlementDetail',
                      });
                    }}
                  >
                    <Text style={styles.listItemTitle}>{entitlement.id}</Text>
                    <Text style={styles.listItemSubtitle}>
                      Status: {entitlement.isActive ? 'Active' : 'Inactive'}
                    </Text>
                    <Text style={styles.listItemSubtitle}>
                      Started: {formatDate(entitlement.startedDate)}
                    </Text>
                    {entitlement.expirationDate && (
                      <Text style={styles.listItemSubtitle}>
                        Expires: {formatDate(entitlement.expirationDate)}
                      </Text>
                    )}
                  </TouchableOpacity>
                )
              )}
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  return renderContent();
};

export default EntitlementsScreen;
