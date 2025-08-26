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
import {
  NoCodesAction,
  NoCodesConfigBuilder,
  ScreenPresentationStyle,
  ScreenPresentationConfig,
  NoCodes,
} from '@qonversion/react-native-sdk';
import type NoCodesError from '../../../../src/dto/NoCodesError';
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

  useEffect(() => {
    // Initialize No-Codes SDK once
    const initializeNoCodes = () => {
      console.log('🔄 [NoCodes] Starting SDK initialization...');
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
