import React from 'react';
import { Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Qonversion from '@qonversion/react-native-sdk';
import { AppContext } from '../../store/AppStore';
import SkeletonLoader from '../../components/SkeletonLoader';
import ProductCard from '../../components/ProductCard';
import styles from './styles';

const ProductsScreen: React.FC = () => {
  const context = React.useContext(AppContext);
  if (!context) return null;
  const { state, dispatch } = context;

  const loadProducts = async () => {
    try {
      console.log('🔄 [Qonversion] Starting products() call...');
      dispatch({ type: 'SET_LOADING', payload: true });
      const products = await Qonversion.getSharedInstance().products();
      console.log('✅ [Qonversion] products() call successful:', Object.fromEntries(products));
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error: any) {
      console.error('❌ [Qonversion] products() call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
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
      <TouchableOpacity style={styles.button} onPress={loadProducts}>
        <Text style={styles.buttonText}>Load Products</Text>
      </TouchableOpacity>

      {state.products && (
        <View style={styles.listContainer}>
          {Array.from(state.products.entries()).map(([id, product]) => (
            <ProductCard key={id} product={product} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ProductsScreen;
