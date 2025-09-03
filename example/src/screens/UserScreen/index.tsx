import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import Qonversion, {
  UserPropertyKey,
  AttributionProvider,
} from '@qonversion/react-native-sdk';
import { AppContext } from '../../store/AppStore';
import SkeletonLoader from '../../components/SkeletonLoader';
import UserInfoSection from '../../components/UserInfoSection';
import styles from './styles';
import Snackbar from 'react-native-snackbar';

const UserScreen: React.FC = () => {
  const [identityId, setIdentityId] = useState('');
  const [propertyKey, setPropertyKey] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [attributionData, setAttributionData] = useState('');
  const [userProperties, setUserProperties] = useState<any>(null);

  // New state for radio button selection
  const [selectedPropertyKey, setSelectedPropertyKey] = useState<
    UserPropertyKey | 'custom'
  >('custom');
  const [selectedAttributionProvider, setSelectedAttributionProvider] =
    useState<AttributionProvider>(AttributionProvider.APPSFLYER);

  const context = React.useContext(AppContext);
  if (!context) return null;
  const { state, dispatch } = context;

  const identify = async () => {
    try {
      console.log(
        '🔄 [Qonversion] Starting identify() call with identityId:',
        identityId
      );
      dispatch({ type: 'SET_LOADING', payload: true });
      const userInfo =
        await Qonversion.getSharedInstance().identify(identityId);
      console.log('✅ [Qonversion] identify() call successful:', userInfo);
      dispatch({ type: 'SET_USER_INFO', payload: userInfo });
      Snackbar.show({
        text: 'User identified successfully!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [Qonversion] identify() call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 [Qonversion] Starting logout() call...');
      Qonversion.getSharedInstance().logout();
      console.log('✅ [Qonversion] logout() call successful');

      console.log('🔄 [Qonversion] Starting userInfo() call after logout...');
      const userInfo = await Qonversion.getSharedInstance().userInfo();
      console.log(
        '✅ [Qonversion] userInfo() call after logout successful:',
        userInfo
      );
      dispatch({ type: 'SET_USER_INFO', payload: userInfo });
      Snackbar.show({
        text: 'User logged out successfully!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [Qonversion] Logout process failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const loadUserInfo = async () => {
    try {
      console.log('🔄 [Qonversion] Starting userInfo() call...');
      dispatch({ type: 'SET_LOADING', payload: true });
      const userInfo = await Qonversion.getSharedInstance().userInfo();
      console.log('✅ [Qonversion] userInfo() call successful:', userInfo);
      dispatch({ type: 'SET_USER_INFO', payload: userInfo });
    } catch (error: any) {
      console.error('❌ [Qonversion] userInfo() call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadUserProperties = async () => {
    try {
      console.log('🔄 [Qonversion] Starting userProperties() call...');
      dispatch({ type: 'SET_LOADING', payload: true });
      const properties = await Qonversion.getSharedInstance().userProperties();
      console.log(
        '✅ [Qonversion] userProperties() call successful:',
        properties
      );
      setUserProperties(properties);
      Snackbar.show({
        text: 'User properties loaded successfully!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [Qonversion] userProperties() call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setUserProperty = async () => {
    try {
      if (propertyValue) {
        if (selectedPropertyKey === 'custom') {
          // For custom properties, use setCustomUserProperty
          if (propertyKey && propertyValue) {
            console.log(
              '🔄 [Qonversion] Starting setCustomUserProperty() call with key:',
              propertyKey,
              'value:',
              propertyValue
            );
            Qonversion.getSharedInstance().setCustomUserProperty(
              propertyKey,
              propertyValue
            );
            console.log(
              '✅ [Qonversion] setCustomUserProperty() call successful'
            );
            Snackbar.show({
              text: 'Custom user property set successfully!',
              duration: Snackbar.LENGTH_SHORT,
            });
          }
        } else {
          // For predefined properties, use setUserProperty
          console.log(
            '🔄 [Qonversion] Starting setUserProperty() call with key:',
            selectedPropertyKey,
            'value:',
            propertyValue
          );
          Qonversion.getSharedInstance().setUserProperty(
            selectedPropertyKey as UserPropertyKey,
            propertyValue
          );
          console.log('✅ [Qonversion] setUserProperty() call successful');
          Snackbar.show({
            text: 'User property set successfully!',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      }
    } catch (error: any) {
      console.error('❌ [Qonversion] Property setting failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const sendAttribution = async () => {
    try {
      if (attributionData && selectedAttributionProvider) {
        const data = JSON.parse(attributionData);
        console.log(
          '🔄 [Qonversion] Starting attribution() call with provider:',
          selectedAttributionProvider,
          'data:',
          data
        );
        Qonversion.getSharedInstance().attribution(
          data,
          selectedAttributionProvider as AttributionProvider
        );
        console.log('✅ [Qonversion] attribution() call successful');
        Snackbar.show({
          text: 'Attribution data sent successfully!',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (error: any) {
      console.error('❌ [Qonversion] attribution() call failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const renderRadioButton = (
    label: string,
    value: string,
    selectedValue: string,
    onSelect: (value: any) => void
  ) => (
    <TouchableOpacity
      key={value}
      style={styles.radioButtonContainer}
      onPress={() => onSelect(value)}
    >
      <View style={styles.radioButton}>
        {selectedValue === value && <View style={styles.radioButtonSelected} />}
      </View>
      <Text style={styles.radioButtonLabel}>{label}</Text>
    </TouchableOpacity>
  );

  if (state.loading) {
    return <SkeletonLoader />;
  }

  const canIdentify = !state.userInfo?.identityId;
  const canLogout = !!state.userInfo?.identityId;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <UserInfoSection userInfo={state.userInfo} />

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Identity ID:</Text>
        <TextInput
          style={styles.textInput}
          value={identityId}
          onChangeText={setIdentityId}
          placeholder="Enter identity ID"
          editable={canIdentify}
        />
        <TouchableOpacity
          style={[styles.button, !canIdentify && styles.disabledButton]}
          onPress={identify}
          disabled={!canIdentify}
        >
          <Text style={styles.buttonText}>Identify</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !canLogout && styles.disabledButton]}
          onPress={logout}
          disabled={!canLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={loadUserInfo}>
          <Text style={styles.buttonText}>User Info</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.sectionTitle}>Properties</Text>
        <TouchableOpacity style={styles.button} onPress={loadUserProperties}>
          <Text style={styles.buttonText}>User Properties</Text>
        </TouchableOpacity>
        {userProperties && (
          <View style={styles.userPropertiesContainer}>
            <Text style={styles.userPropertiesTitle}>User Properties:</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderKey} numberOfLines={1}>
                Key
              </Text>
              <Text style={styles.tableHeaderValue} numberOfLines={1}>
                Value
              </Text>
            </View>
            <View style={styles.tableContainer}>
              {userProperties.properties.map((property: any, index: number) => (
                <View
                  key={property.key}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 && styles.tableRowEven,
                  ]}
                >
                  <Text
                    style={styles.tableCellKey}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {property.key}
                  </Text>
                  <Text
                    style={styles.tableCellValue}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {property.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.inputLabel}>Property Key:</Text>

        {/* UserPropertyKey Radio Buttons */}
        <View style={styles.radioGroup}>
          {Object.values(UserPropertyKey)
            .filter((key) => key !== UserPropertyKey.CUSTOM)
            .map((key) =>
              renderRadioButton(
                key,
                key,
                selectedPropertyKey,
                setSelectedPropertyKey
              )
            )}
          {renderRadioButton(
            'Custom (Manual Input)',
            'custom',
            selectedPropertyKey,
            setSelectedPropertyKey
          )}
        </View>

        {selectedPropertyKey === 'custom' && (
          <TextInput
            style={styles.textInput}
            value={propertyKey}
            onChangeText={setPropertyKey}
            placeholder="Enter custom property key"
          />
        )}

        <Text style={styles.inputLabel}>Property Value:</Text>
        <TextInput
          style={styles.textInput}
          value={propertyValue}
          onChangeText={setPropertyValue}
          placeholder="Enter property value"
        />
        <TouchableOpacity style={styles.button} onPress={setUserProperty}>
          <Text style={styles.buttonText}>Set Property</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.sectionTitle}>Attribution</Text>
        <Text style={styles.inputLabel}>Attribution Data (JSON):</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          value={attributionData}
          onChangeText={setAttributionData}
          placeholder='{"key": "value"}'
          multiline
        />

        <Text style={styles.inputLabel}>Attribution Provider:</Text>

        {/* AttributionProvider Radio Buttons */}
        <View style={styles.radioGroup}>
          {Object.values(AttributionProvider).map((provider) =>
            renderRadioButton(
              provider,
              provider,
              selectedAttributionProvider,
              setSelectedAttributionProvider
            )
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={sendAttribution}>
          <Text style={styles.buttonText}>Send Attribution</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserScreen;
