import React, { useReducer, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';
import { AppContext, initialState, appReducer, getCurrentScreen } from './store/AppStore';
import Qonversion, {
  QonversionConfigBuilder,
  LaunchMode,
  Environment,
  EntitlementsCacheLifetime,
} from '@qonversion/react-native-sdk';
import MainScreen from './screens/MainScreen';
import ProductsScreen from './screens/ProductsScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import EntitlementsScreen from './screens/EntitlementsScreen';
import EntitlementDetailScreen from './screens/EntitlementDetailScreen';
import OfferingsScreen from './screens/OfferingsScreen';
import RemoteConfigsScreen from './screens/RemoteConfigsScreen';
import UserScreen from './screens/UserScreen';
import NoCodesScreen from './screens/NoCodesScreen';
import OtherScreen from './screens/OtherScreen';

const ProjectKey = 'PV77YHL7qnGvsdmpTs7gimsxUvY-Znl2';

// Main App Component
const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadUserInfo = async () => {
    try {
      console.log('🔄 [Qonversion] Starting userInfo() call...');
      const userInfo = await Qonversion.getSharedInstance().userInfo();
      console.log('✅ [Qonversion] userInfo() call successful:', userInfo);
      dispatch({ type: 'SET_USER_INFO', payload: userInfo });
    } catch (error: any) {
      console.error('❌ [Qonversion] userInfo() call failed:', error);
      // Don't show alert for userInfo errors as they're not critical
    }
  };

  useEffect(() => {
    // Initialize Qonversion SDK only once per session
    if (!state.isQonversionInitialized) {
      const initializeQonversion = async () => {
        try {
          console.log('🔄 [Qonversion] Starting SDK initialization...');
          dispatch({ type: 'SET_QONVERSION_INIT_STATUS', payload: 'initializing' });
          
          console.log('🔄 [Qonversion] Building config...');
          const config = new QonversionConfigBuilder(ProjectKey, LaunchMode.SUBSCRIPTION_MANAGEMENT)
            .setEnvironment(Environment.SANDBOX)
            .setEntitlementsCacheLifetime(EntitlementsCacheLifetime.MONTH)
            .setEntitlementsUpdateListener({
              onEntitlementsUpdated(entitlements: any) {
                console.log('📡 [Qonversion] Entitlements updated via listener:', entitlements);
                dispatch({ type: 'SET_ENTITLEMENTS', payload: entitlements });
              },
            })
            .setProxyURL("api-eu.qonversion.io")
            .build();
          console.log('✅ [Qonversion] Config built successfully:', config);
          
          console.log('🔄 [Qonversion] Initializing SDK...');
          Qonversion.initialize(config);
          console.log('✅ [Qonversion] SDK initialized successfully');
          dispatch({ type: 'SET_QONVERSION_INIT_STATUS', payload: 'success' });
          dispatch({ type: 'SET_QONVERSION_INITIALIZED', payload: true });

          // Load initial user info asynchronously
          loadUserInfo();
          
        } catch (error: any) {
          console.error('❌ [Qonversion] SDK initialization failed:', error);
          dispatch({ type: 'SET_QONVERSION_INIT_STATUS', payload: 'error' });
          Alert.alert('Initialization Error', error.message || 'Failed to initialize Qonversion SDK');
        }
      };

      initializeQonversion();
    }
  }, [state.isQonversionInitialized]);

  const renderScreen = () => {
    const currentScreen = getCurrentScreen(state);
    switch (currentScreen) {
      case 'main':
        return <MainScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'productDetail':
        return state.selectedProduct ? <ProductDetailScreen product={state.selectedProduct} /> : <ProductsScreen />;
      case 'entitlements':
        return <EntitlementsScreen />;
      case 'entitlementDetail':
        return state.selectedEntitlement ? <EntitlementDetailScreen entitlement={state.selectedEntitlement} /> : <EntitlementsScreen />;
      case 'offerings':
        return <OfferingsScreen />;
      case 'remoteConfigs':
        return <RemoteConfigsScreen />;
      case 'user':
        return <UserScreen />;
      case 'noCodes':
        return <NoCodesScreen />;
      case 'other':
        return <OtherScreen />;
      default:
        return <MainScreen />;
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {getCurrentScreen(state) !== 'main' && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (getCurrentScreen(state) === 'productDetail') {
                  dispatch({ type: 'SET_SELECTED_PRODUCT', payload: null });
                }
                if (getCurrentScreen(state) === 'entitlementDetail') {
                  dispatch({ type: 'SET_SELECTED_ENTITLEMENT', payload: null });
                }
                dispatch({ type: 'POP_SCREEN' });
              }}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {getCurrentScreen(state) === 'main' ? 'Qonversion SDK Demo' : getCurrentScreen(state).charAt(0).toUpperCase() + getCurrentScreen(state).slice(1)}
          </Text>
        </View>
        {renderScreen()}
      </SafeAreaView>
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default App;
