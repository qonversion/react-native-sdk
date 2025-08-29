import React from 'react';
import { View, StyleSheet } from 'react-native';

const SkeletonLoader: React.FC = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonItem} />
    <View style={styles.skeletonItem} />
    <View style={styles.skeletonItem} />
  </View>
);

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    padding: 16,
  },
  skeletonItem: {
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default SkeletonLoader;
