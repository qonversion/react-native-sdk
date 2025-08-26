import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import Qonversion, { RemoteConfigList } from '@qonversion/react-native-sdk';
import { AppContext } from '../../store/AppStore';
import SkeletonLoader from '../../components/SkeletonLoader';
import styles from './styles';
import Snackbar from 'react-native-snackbar';

const RemoteConfigsScreen: React.FC = () => {
  const context = React.useContext(AppContext);
  if (!context) return null;
  const { state, dispatch } = context;

  const [contextKeys, setContextKeys] = useState('');
  const [singleContextKey, setSingleContextKey] = useState('');
  const [experimentId, setExperimentId] = useState('');
  const [groupId, setGroupId] = useState('');

  const loadRemoteConfigList = async () => {
    try {
      console.log('🔄 [Qonversion] Starting remoteConfigList call...');
      dispatch({ type: 'SET_LOADING', payload: true });
      let remoteConfigs;
      if (contextKeys.trim()) {
        const keys = contextKeys.split(',').map(k => k.trim());
        console.log('🔄 [Qonversion] Calling remoteConfigListForContextKeys with keys:', keys);
        remoteConfigs = await Qonversion.getSharedInstance().remoteConfigListForContextKeys(keys, true);
        console.log('✅ [Qonversion] remoteConfigListForContextKeys call successful:', remoteConfigs);
      } else {
        console.log('🔄 [Qonversion] Calling remoteConfigList...');
        remoteConfigs = await Qonversion.getSharedInstance().remoteConfigList();
        console.log('✅ [Qonversion] remoteConfigList call successful:', remoteConfigs);
      }
      dispatch({ type: 'SET_REMOTE_CONFIGS', payload: remoteConfigs });
    } catch (error: any) {
      console.error('❌ [Qonversion] Remote config list call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadSingleRemoteConfig = async () => {
    try {
      console.log('🔄 [Qonversion] Starting remoteConfig call with contextKey:', singleContextKey);
      dispatch({ type: 'SET_LOADING', payload: true });
      const config = await Qonversion.getSharedInstance().remoteConfig(singleContextKey || undefined);
      console.log('✅ [Qonversion] remoteConfig call successful:', config);
      // Create a RemoteConfigList with a single config
      const remoteConfigList = new RemoteConfigList([config]);
      dispatch({ type: 'SET_REMOTE_CONFIGS', payload: remoteConfigList });
    } catch (error: any) {
      console.error('❌ [Qonversion] remoteConfig call failed:', error);
      Alert.alert('Error', error.message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const attachToExperiment = async () => {
    try {
      console.log('🔄 [Qonversion] Starting attachUserToExperiment call with experimentId:', experimentId, 'groupId:', groupId);
      await Qonversion.getSharedInstance().attachUserToExperiment(experimentId, groupId);
      console.log('✅ [Qonversion] attachUserToExperiment call successful');
      Snackbar.show({
        text: 'User attached to experiment!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [Qonversion] attachUserToExperiment call failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const detachFromExperiment = async () => {
    try {
      console.log('🔄 [Qonversion] Starting detachUserFromExperiment call with experimentId:', experimentId);
      await Qonversion.getSharedInstance().detachUserFromExperiment(experimentId);
      console.log('✅ [Qonversion] detachUserFromExperiment call successful');
      Snackbar.show({
        text: 'User detached from experiment!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error: any) {
      console.error('❌ [Qonversion] detachUserFromExperiment call failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  if (state.loading) {
    return <SkeletonLoader />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Context Keys (comma-separated):</Text>
        <TextInput
          style={styles.textInput}
          value={contextKeys}
          onChangeText={setContextKeys}
          placeholder="key1, key2, key3"
        />
        <TouchableOpacity style={styles.button} onPress={loadRemoteConfigList}>
          <Text style={styles.buttonText}>Get Remote Config List</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Single Context Key:</Text>
        <TextInput
          style={styles.textInput}
          value={singleContextKey}
          onChangeText={setSingleContextKey}
          placeholder="Enter context key"
        />
        <TouchableOpacity style={styles.button} onPress={loadSingleRemoteConfig}>
          <Text style={styles.buttonText}>Get Remote Config</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Experiment ID:</Text>
        <TextInput
          style={styles.textInput}
          value={experimentId}
          onChangeText={setExperimentId}
          placeholder="Enter experiment ID"
        />
        <Text style={styles.inputLabel}>Group ID:</Text>
        <TextInput
          style={styles.textInput}
          value={groupId}
          onChangeText={setGroupId}
          placeholder="Enter group ID"
        />
        <TouchableOpacity style={styles.button} onPress={attachToExperiment}>
          <Text style={styles.buttonText}>Attach To Experiment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={detachFromExperiment}>
          <Text style={styles.buttonText}>Detach From Experiment</Text>
        </TouchableOpacity>
      </View>

      {state.remoteConfigs && (
        <View style={styles.listContainer}>
          {state.remoteConfigs.remoteConfigs.map((config, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemTitle}>Context Key: {config.source.contextKey || 'empty'}</Text>
              <Text style={styles.listItemSubtitle}>Source: {config.source.name}</Text>
              <Text style={styles.listItemSubtitle}>Type: {config.source.type}</Text>
              <Text style={styles.listItemSubtitle}>Payload: {JSON.stringify(config.payload)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default RemoteConfigsScreen;
