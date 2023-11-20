/* eslint-disable prettier/prettier,react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {Image, TouchableOpacity, StyleSheet, Text, View, SafeAreaView, ActivityIndicator, Alert} from 'react-native';

type StateType = {
  inAppButtonTitle: string;
  subscriptionButtonTitle: string;
  loading: boolean;
};

export class QonversionSample extends React.PureComponent<{}, StateType> {
  constructor(props) {
    super(props);

    this.state = {
      inAppButtonTitle: 'Loading...',
      subscriptionButtonTitle: 'Loading...',
      loading: true,
    };

    // eslint-disable-next-line consistent-this
    const outerClassRef = this; // necessary for anonymous classes to access this.
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'stretch', alignContent: 'stretch'}}>
        <Image
          style={{
            marginTop: 42,
            width: 100,
            height: 100,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
          source={require('./q_icon.png')}
        />
        <Text style={{fontSize: 28, fontWeight: 'bold', alignSelf: 'center', marginTop: 42, textAlign: 'center'}}>
          {'Build in-app\nsubscriptions'}
        </Text>
        <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginTop: 4, textAlign: 'center'}}>
          {'without server code'}
        </Text>
        {this.state.loading &&
          <ActivityIndicator size="small" color="#0f0f0f"/>
        }
        <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 64, marginTop: 10}}>
          <Text style={{fontSize: 15, fontWeight: '500', alignSelf: 'center', textAlign: 'center'}}>Start with 3
            days free trial</Text>
          <TouchableOpacity
            style={styles.subscriptionButton}
            onPress={() => {
              this.setState({loading: true});
              // purchase subscription here
            }}
          >
            <Text style={styles.buttonTitle}>{this.state.subscriptionButtonTitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inAppButton}
            onPress={() => {
              this.setState({loading: true});
              // purchase consumable/nonconsumable in-app here
            }}
          >
            <Text style={styles.inAppButtonTitle}>{this.state.inAppButtonTitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.additionalButton}
            onPress={() => {
              this.setState({loading: true});
              // hanle restore here
            }}
          >
            <Text style={styles.additionalButtonsText}>Restore purchases</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  additionalButtonsText: {
    flex: 1,
    textAlign: 'center',
  },
  additionalButton: {
    flexDirection: 'row',
    height: 40,
    marginHorizontal: 32,
    alignItems: 'center',
  },
  subscriptionButton: {
    flexDirection: 'row',
    marginHorizontal: 32,
    height: 54,
    marginTop: 10,
    backgroundColor: '#3E5AE1',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3E5AE1',
    alignItems: 'center',
  },
  inAppButton: {
    flexDirection: 'row',
    marginHorizontal: 32,
    height: 54,
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3E5AE1',
    alignItems: 'center',
  },
  inAppButtonTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#3E5AE1',
  },
  buttonTitle: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
  },
});
export default class App extends Component {
  render() {
    return (
      <>
        <SafeAreaView style={{flex: 1}}>
          <QonversionSample/>
        </SafeAreaView>
      </>
    );
  }
}
