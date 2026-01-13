import React from 'react';
import { Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Snackbar from 'react-native-snackbar';
import Qonversion, { Product } from '@qonversion/react-native-sdk';
import { AppContext } from '../../store/AppStore';
import SkeletonLoader from '../../components/SkeletonLoader';
import styles from './styles';

interface ProductDetailScreenProps {
  product: Product;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
}) => {
  const context = React.useContext(AppContext);
  if (!context) return null;
  const { state, dispatch } = context;

  const purchaseProduct = async () => {
    try {
      console.log(
        '🔄 [Qonversion] Starting purchaseWithResult() call with product:',
        product
      );
      dispatch({ type: 'SET_LOADING', payload: true });
      const result =
        await Qonversion.getSharedInstance().purchaseWithResult(product);
      console.log(
        '✅ [Qonversion] purchaseWithResult() call completed with status:',
        result.status
      );

      console.log('📦 [Qonversion] Purchase result:', result);

      if (result.isSuccess) {
        console.log('✅ [Qonversion] Purchase successful!');
        if (result.entitlements) {
          dispatch({ type: 'SET_ENTITLEMENTS', payload: result.entitlements });
        }
        Snackbar.show({
          text: 'Product purchased successfully!',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else if (result.isCanceled) {
        console.log('ℹ️ [Qonversion] Purchase canceled by user');
        Snackbar.show({
          text: 'Purchase was canceled',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else if (result.isPending) {
        console.log('⏳ [Qonversion] Purchase is pending');
        Snackbar.show({
          text: 'Purchase is pending approval',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else if (result.isError) {
        console.error('❌ [Qonversion] Purchase failed with error:', result.error);
        Alert.alert('Purchase Error', result.error?.description || 'An error occurred');
      }

    } catch (error: any) {
      console.error('❌ [Qonversion] purchaseWithResult() call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (state.loading) {
    return <SkeletonLoader />;
  }

  const renderField = (label: string, value: any) => {
    if (value === null || value === undefined) return null;
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}:</Text>
        <Text style={styles.fieldValue}>{String(value)}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {product.storeTitle || product.qonversionId}
        </Text>
        {product.prettyPrice && (
          <Text style={styles.price}>{product.prettyPrice}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        {renderField('Qonversion ID', product.qonversionId)}
        {renderField('Store ID', product.storeId)}
        {renderField('Base Plan ID', product.basePlanId)}
        {renderField('Type', product.type)}
        {renderField('Offering ID', product.offeringId)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing</Text>
        {renderField('Pretty Price', product.prettyPrice)}
        {renderField('Price', product.price)}
        {renderField('Currency Code', product.currencyCode)}
        {renderField(
          'Pretty Introductory Price',
          product.prettyIntroductoryPrice
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store Information</Text>
        {renderField('Store Title', product.storeTitle)}
        {renderField('Store Description', product.storeDescription)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription Details</Text>
        {product.subscriptionPeriod && (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Subscription Period:</Text>
            <Text style={styles.fieldValue}>
              {product.subscriptionPeriod.unitCount}{' '}
              {product.subscriptionPeriod.unit}
            </Text>
          </View>
        )}
        {product.trialPeriod && (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Trial Period:</Text>
            <Text style={styles.fieldValue}>
              {product.trialPeriod.unitCount} {product.trialPeriod.unit}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseProduct}>
        <Text style={styles.purchaseButtonText}>Purchase Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProductDetailScreen;
