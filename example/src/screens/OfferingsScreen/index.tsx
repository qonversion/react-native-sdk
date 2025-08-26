import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Qonversion from '@qonversion/react-native-sdk';
import { AppContext } from '../../store/AppStore';
import SkeletonLoader from '../../components/SkeletonLoader';
import ProductCard from '../../components/ProductCard';
import styles from './styles';

const OfferingsScreen: React.FC = () => {
  const context = React.useContext(AppContext);
  if (!context) return null;
  const { state, dispatch } = context;

  const loadOfferings = async () => {
    try {
      console.log('🔄 [Qonversion] Starting offerings() call...');
      dispatch({ type: 'SET_LOADING', payload: true });
      const offerings = await Qonversion.getSharedInstance().offerings();
      console.log('✅ [Qonversion] offerings() call successful:', offerings);
      if (offerings) {
        dispatch({ type: 'SET_OFFERINGS', payload: offerings });
      }
    } catch (error: any) {
      console.error('❌ [Qonversion] offerings() call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (state.loading) {
    return <SkeletonLoader />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity style={styles.button} onPress={loadOfferings}>
        <Text style={styles.buttonText}>Load Offerings</Text>
      </TouchableOpacity>

      {state.offerings ? (
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Main Offering ID: {state.offerings.main?.id}</Text>
          
          {state.offerings.availableOffering.map((offering) => (
            <View key={offering.id} style={styles.offeringContainer}>
              <Text style={styles.offeringTitle}>{offering.id}</Text>
              <Text style={styles.offeringSubtitle}>Tag: {offering.tag}</Text>
              
              {offering.products.length > 0 ? (
                <View style={styles.productsContainer}>
                  <Text style={styles.productsTitle}>Products:</Text>
                  {offering.products.map((product) => (
                    <ProductCard key={product.qonversionId} product={product} />
                  ))}
                </View>
              ) : (
                <Text style={styles.noProductsText}>No products in this offering</Text>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Offerings Loaded</Text>
          <Text style={styles.emptyStateSubtitle}>
            Tap the button above to load available offerings
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default OfferingsScreen;
