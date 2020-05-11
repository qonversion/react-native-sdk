/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Button, Text, View, SafeAreaView} from 'react-native';
import RNQonversion from 'react-native-qonversion';

const NO_UID_LABEL = 'No UID yet';

export class QonversionStatus extends Component {
  state = { uid: NO_UID_LABEL };

  render(props) {
    return (
      <View>
        <Text>
          Current uid is: {this.state.uid}
        </Text>
        <Button
          onPress={() => {
            // RNQonversion.sampleMethod('string', 7, (args) => console.log(args));
            RNQonversion.launchWithKey('sample', (uid) => {
              this.setState(() => this.state.uid = uid);
              console.log(uid);
            });
            // console.log(RNQonversion);
          }}
          disabled={!(this.state.uid === NO_UID_LABEL)}
          title={
            this.state.uid === NO_UID_LABEL ? 'Initialize Qonversion' : 'Good work'
          }
        />
      </View>
    );
  }
}

export default class App extends Component {
  render() {
    return (
      <>
        <SafeAreaView>
          <QonversionStatus />
        </SafeAreaView>
      </>
    );
  }
}
