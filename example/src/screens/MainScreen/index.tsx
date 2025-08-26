import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';
import { AppContext } from '../../store/AppStore';
import styles from './styles';

const MainScreen: React.FC = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    console.error('AppContext is null in MainScreen');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: AppContext not available</Text>
      </View>
    );
  }
  
  const { state, dispatch } = context;

  const menuItems = [
    { id: 'products', title: 'Products' },
    { id: 'entitlements', title: 'Entitlements' },
    { id: 'offerings', title: 'Offerings' },
    { id: 'remoteConfigs', title: 'Remote Configs' },
    { id: 'user', title: 'User' },
    { id: 'noCodes', title: 'No-Codes' },
    { id: 'other', title: 'Other' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image
        style={styles.logo}
        source={require('../../../assets/q_icon.png')}
      />
      <Text style={styles.title}>Qonversion SDK Demo</Text>
      
      <View style={styles.initIndicatorContainer}>
        <View style={[
          styles.initIndicator,
          state.qonversionInitStatus === 'not_initialized' && styles.initIndicatorGray,
          state.qonversionInitStatus === 'initializing' && styles.initIndicatorGray,
          state.qonversionInitStatus === 'success' && styles.initIndicatorGreen,
          state.qonversionInitStatus === 'error' && styles.initIndicatorRed,
        ]} />
        <Text style={styles.initIndicatorText}>
          {state.qonversionInitStatus === 'not_initialized' && 'Initialization not completed'}
          {state.qonversionInitStatus === 'initializing' && 'Initializing...'}
          {state.qonversionInitStatus === 'success' && 'Initialization successful'}
          {state.qonversionInitStatus === 'error' && 'Initialization error'}
        </Text>
      </View>
      
      {state.userInfo && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoTitle}>Current User:</Text>
          <TouchableOpacity
            style={styles.userInfoRow}
            onPress={() => {
              Clipboard.setString(state.userInfo?.qonversionId || '');
              Snackbar.show({
                text: 'Qonversion ID copied to clipboard',
                duration: Snackbar.LENGTH_SHORT,
              });
            }}
          >
            <Text style={styles.userInfoLabel}>Qonversion ID:</Text>
            <Text style={styles.userInfoValue}>{state.userInfo?.qonversionId || 'Not available'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userInfoRow}
            onPress={() => {
              Clipboard.setString(state.userInfo?.identityId || '');
              Snackbar.show({
                text: 'Identity ID copied to clipboard',
                duration: Snackbar.LENGTH_SHORT,
              });
            }}
          >
            <Text style={styles.userInfoLabel}>Identity ID:</Text>
            <Text style={styles.userInfoValue}>{state.userInfo?.identityId || 'Anonymous'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => dispatch({ type: 'PUSH_SCREEN', payload: item.id })}
          >
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default MainScreen;
