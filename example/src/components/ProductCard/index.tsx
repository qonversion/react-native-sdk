import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Product } from '@qonversion/react-native-sdk';
import { AppContext } from '../../store/AppStore';
import styles from './styles';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const context = React.useContext(AppContext);
  if (!context) return null;
  const { dispatch } = context;

  const handlePress = () => {
    dispatch({ type: 'SET_SELECTED_PRODUCT', payload: product });
    dispatch({ type: 'PUSH_SCREEN', payload: 'productDetail' });
  };

  return (
    <TouchableOpacity style={styles.listItem} onPress={handlePress}>
      <Text style={styles.listItemTitle}>{product.qonversionId}</Text>
      <Text style={styles.listItemSubtitle}>Store ID: {product.storeId}</Text>
      <Text style={styles.listItemSubtitle}>
        Base Plan ID: {product.basePlanId}
      </Text>
      <Text style={styles.listItemSubtitle}>Type: {product.type}</Text>
      <Text style={styles.listItemSubtitle}>
        Price: {product.prettyPrice || 'N/A'}
      </Text>
    </TouchableOpacity>
  );
};

export default ProductCard;
