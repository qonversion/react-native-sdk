import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import Qonversion, {
  NoCodesAction,
  NoCodesConfigBuilder,
  ScreenPresentationStyle,
  ScreenPresentationConfig,
  NoCodes,
  NoCodesError,
  NoCodesTheme,
  type PurchaseDelegate,
  Product
} from '@qonversion/react-native-sdk';
import { AppContext } from '../../store/AppStore';
import styles from './styles';
import Snackbar from 'react-native-snackbar';

const ProjectKey = 'PV77YHL7qnGvsdmpTs7gimsxUvY-Znl2';

const NoCodesScreen: React.FC = () => {
  const context = React.useContext(AppContext);
  if (!context) return null;
  const { state, dispatch } = context;

  const [contextKey, setContextKey] = useState('kamo_test');
  const [presentationStyle, setPresentationStyle] = useState(
    ScreenPresentationStyle.FULL_SCREEN
  );
  const [animated, setAnimated] = useState(false);
  const [locale, setLocale] = useState('');
  const [theme, setTheme] = useState<NoCodesTheme>(NoCodesTheme.AUTO);

  useEffect(() => {
    // Initialize No-Codes SDK once
    const initializeNoCodes = () => {
      console.log('🔄 [NoCodes] Starting SDK initialization...');
      // @ts-ignore - PurchaseDelegate is not used until the comment below is uncommented
      const purchaseDelegate: PurchaseDelegate = {
        purchase: async (product: Product) => {
          console.log('🔄 [PurchaseDelegate] Starting purchase for product:', product.qonversionId);
          const result = await Qonversion.getSharedInstance().purchaseWithResult(product);
          console.log('✅ [PurchaseDelegate] Purchase result:', result.status);

          if (result.isSuccess) {
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: `Purchase completed: ${product.qonversionId}` });
            Snackbar.show({
              text: `Purchase completed: ${product.qonversionId}`,
              duration: Snackbar.LENGTH_SHORT,
            });
          } else if (result.isCanceled) {
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: `Purchase canceled: ${product.qonversionId}` });
          } else if (result.isPending) {
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: `Purchase pending: ${product.qonversionId}` });
          } else if (result.isError) {
            console.error('❌ [PurchaseDelegate] Purchase failed:', result.error);
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: `Purchase failed: ${result.error?.description}` });
            throw new Error(result.error?.description || 'Purchase failed');
          }
        },
        restore: async () => {
          console.log('🔄 [PurchaseDelegate] Starting restore...');
          try {
            const entitlements = await Qonversion.getSharedInstance().restore();
            console.log('✅ [PurchaseDelegate] Restore successful:', Object.fromEntries(entitlements));
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: 'Restore completed' });
            Snackbar.show({
              text: 'Restore completed successfully!',
              duration: Snackbar.LENGTH_SHORT,
            });
          } catch (error: any) {
            console.error('❌ [PurchaseDelegate] Restore failed:', error);
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: `Restore failed: ${error.message}` });
            throw error; // Re-throw to let NoCodes SDK handle the error
          }
        },
      };

      const noCodesConfig = new NoCodesConfigBuilder(ProjectKey)
        .setNoCodesListener({
          onScreenShown: (id: string) => {
            const event = `Screen shown: ${id}`;
            console.log('📡 [NoCodes] Screen shown event:', id);
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: event });
          },
          onActionStartedExecuting: (action: NoCodesAction) => {
            const event = `Action started: ${action.type}`;
            console.log('📡 [NoCodes] Action started event:', action);
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: event });
          },
          onActionFailedToExecute: (action: NoCodesAction) => {
            const event = `Action failed: ${action.type}`;
            console.log('📡 [NoCodes] Action failed event:', action);
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: event });
          },
          onActionFinishedExecuting: (action: NoCodesAction) => {
            const event = `Action finished: ${action.type}`;
            console.log('📡 [NoCodes] Action finished event:', action);
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: event });
          },
          onFinished: () => {
            const event = 'Flow finished';
            console.log('📡 [NoCodes] Flow finished event');
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: event });
          },
          onScreenFailedToLoad: (error: NoCodesError) => {
            const event = `Screen failed to load: ${error.description || error.code}`;
            console.log('📡 [NoCodes] Screen failed to load event:', error);
            dispatch({ type: 'ADD_NOCODES_EVENT', payload: event });
            NoCodes.getSharedInstance().close();
          },
        })
        // .setPurchaseDelegate(purchaseDelegate) // Uncomment this to use the purchase delegate
        .build();
      console.log('✅ [NoCodes] Config built successfully:', noCodesConfig);

      console.log('🔄 [NoCodes] Initializing SDK...');
      NoCodes.initialize(noCodesConfig);
      console.log('✅ [NoCodes] SDK initialized successfully');
    };

    initializeNoCodes();
  }, []);

  const showScreen = () => {
    try {
      console.log(
        '🔄 [NoCodes] Starting showScreen() call with contextKey:',
        contextKey
      );
      NoCodes.getSharedInstance().showScreen(contextKey);
      console.log('✅ [NoCodes] showScreen() call successful');
    } catch (error: any) {
      console.error('❌ [NoCodes] showScreen() call failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const setPresentationConfig = () => {
    try {
      console.log(
        '🔄 [NoCodes] Starting setScreenPresentationConfig() call with contextKey:',
        contextKey,
        'config:',
        { presentationStyle, animated }
      );
      const config = new ScreenPresentationConfig(presentationStyle, animated);

      NoCodes.getSharedInstance().setScreenPresentationConfig(
        config,
        contextKey
      );
      console.log('✅ [NoCodes] setScreenPresentationConfig() call successful');
      Snackbar.show({
        text: 'Presentation config set successfully!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error(
        '❌ [NoCodes] setScreenPresentationConfig() call failed:',
        error
      );
      Alert.alert('Error', error.message);
    }
  };

  const close = () => {
    try {
      console.log('🔄 [NoCodes] Starting close() call...');
      NoCodes.getSharedInstance().close();
      console.log('✅ [NoCodes] close() call successful');
      Snackbar.show({
        text: 'No-Codes screen closed!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [NoCodes] close() call failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const applyLocale = () => {
    try {
      const localeValue = locale.trim() || null;
      console.log('🔄 [NoCodes] Setting locale to:', localeValue);
      NoCodes.getSharedInstance().setLocale(localeValue);
      console.log('✅ [NoCodes] setLocale() call successful');
      Snackbar.show({
        text: localeValue ? `Locale set to: ${localeValue}` : 'Locale reset to device default',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [NoCodes] setLocale() call failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const resetLocale = () => {
    try {
      console.log('🔄 [NoCodes] Resetting locale to device default...');
      NoCodes.getSharedInstance().setLocale(null);
      setLocale('');
      console.log('✅ [NoCodes] Locale reset successful');
      Snackbar.show({
        text: 'Locale reset to device default',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [NoCodes] resetLocale() call failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const applyTheme = (selectedTheme: NoCodesTheme) => {
    try {
      console.log('🔄 [NoCodes] Setting theme to:', selectedTheme);
      setTheme(selectedTheme);
      NoCodes.getSharedInstance().setTheme(selectedTheme);
      console.log('✅ [NoCodes] setTheme() call successful');
      Snackbar.show({
        text: `Theme set to: ${selectedTheme}`,
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [NoCodes] setTheme() call failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Context Key:</Text>
        <TextInput
          style={styles.textInput}
          value={contextKey}
          onChangeText={setContextKey}
          placeholder="Enter context key"
        />
        <TouchableOpacity style={styles.button} onPress={showScreen}>
          <Text style={styles.buttonText}>Show No-Code Screen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.sectionTitle}>Presentation Config</Text>
        <Text style={styles.inputLabel}>Screen Presentation Style:</Text>
        {Object.values(ScreenPresentationStyle).map((style) => (
          <TouchableOpacity
            key={style}
            style={[
              styles.radioButton,
              presentationStyle === style && styles.radioButtonSelected,
            ]}
            onPress={() => setPresentationStyle(style)}
          >
            <Text style={styles.radioButtonText}>{style}</Text>
          </TouchableOpacity>
        ))}

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.checkbox, animated && styles.checkboxSelected]}
            onPress={() => setAnimated(!animated)}
          >
            <Text style={styles.checkboxText}>Animated (iOS only)</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={setPresentationConfig}>
          <Text style={styles.buttonText}>Set Presentation Config</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.sectionTitle}>Locale</Text>
        <Text style={styles.inputLabel}>Locale code (e.g. "en", "de", "fr"):</Text>
        <TextInput
          style={styles.textInput}
          value={locale}
          onChangeText={setLocale}
          placeholder="Leave empty for device default"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.button} onPress={applyLocale}>
          <Text style={styles.buttonText}>Set Locale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={resetLocale}>
          <Text style={styles.secondaryButtonText}>Reset to Device Default</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <Text style={styles.inputLabel}>Select theme mode:</Text>
        {Object.values(NoCodesTheme).map((themeOption) => (
          <TouchableOpacity
            key={themeOption}
            style={[
              styles.radioButton,
              theme === themeOption && styles.radioButtonSelected,
            ]}
            onPress={() => applyTheme(themeOption)}
          >
            <Text style={styles.radioButtonText}>{themeOption}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={close}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>

      <View style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>No-Codes Events:</Text>
        <ScrollView style={styles.eventsList}>
          {state.noCodesEvents.map((event, index) => (
            <Text key={index} style={styles.eventText}>
              {event}
            </Text>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default NoCodesScreen;
