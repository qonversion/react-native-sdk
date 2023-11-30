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
import Qonversion, {
  Product,
  QonversionConfigBuilder,
  LaunchMode,
  Environment,
  Entitlement,
  EntitlementsCacheLifetime,
} from 'react-native-qonversion';
import NotificationsManager from './notificationsManager';

NotificationsManager.init();

type StateType = {
  inAppButtonTitle: string;
  subscriptionButtonTitle: string;
  loading: boolean;
  checkEntitlementsHidden: boolean;
};

export class QonversionSample extends React.PureComponent<{}, StateType> {
  constructor(props) {
    super(props);

    this.state = {
      inAppButtonTitle: 'Loading...',
      subscriptionButtonTitle: 'Loading...',
      loading: true,
      checkEntitlementsHidden: true,
    };

    // eslint-disable-next-line consistent-this
    const outerClassRef = this; // necessary for anonymous classes to access this.
    const config = new QonversionConfigBuilder(
      'PV77YHL7qnGvsdmpTs7gimsxUvY-Znl2',
      LaunchMode.SUBSCRIPTION_MANAGEMENT
    )
      .setEnvironment(Environment.SANDBOX)
      .setEntitlementsCacheLifetime(EntitlementsCacheLifetime.MONTH)
      .setEntitlementsUpdateListener({
        onEntitlementsUpdated(entitlements) {
          console.log('Entitlements updated!', entitlements);
          outerClassRef.handleEntitlements(entitlements);
        },
      })
      .build();
    Qonversion.initialize(config);
    Qonversion.getSharedInstance().setPromoPurchasesDelegate({
      onPromoPurchaseReceived: async (productId, promoPurchaseExecutor) => {
        try {
          const entitlements = await promoPurchaseExecutor(productId);
          console.log('Promo purchase completed. Entitlements: ', entitlements);
          outerClassRef.handleEntitlements(entitlements);
        } catch (e) {
          console.log('Promo purchase failed.');
        }
      },
    });
    Qonversion.getSharedInstance().checkEntitlements().then(entitlements => {
      this.handleEntitlements(entitlements);
    });
  }

  handleEntitlements(entitlements) {
    let checkActiveEntitlementsButtonHidden = this.state.checkEntitlementsHidden;
    if (entitlements.size > 0) {
      const entitlementsValues = Array.from(entitlements.values());
      checkActiveEntitlementsButtonHidden = !entitlementsValues.some(item => item.isActive === true);
    }
    Qonversion.getSharedInstance().products().then(products => {
      let inAppTitle = this.state.inAppButtonTitle;
      let subscriptionButtonTitle = this.state.subscriptionButtonTitle;

      const inApp: Product = products.get('in_app');
      if (inApp) {
        inAppTitle = 'Buy for ' + inApp.prettyPrice;
        const entitlement = entitlements.get('Test Entitlement');
        if (entitlement) {
          inAppTitle = entitlement.isActive ? 'Purchased' : inAppTitle;
        }
      }

      const main: Product = products.get('weekly');
      if (main) {
        subscriptionButtonTitle = 'Subscribe for ' + main.prettyPrice + ' / ' + main.subscriptionPeriod.unitCount + ' ' + main.subscriptionPeriod.unit;
        const entitlement = entitlements.get('plus');
        if (entitlement) {
          subscriptionButtonTitle = entitlement.isActive ? 'Purchased' : subscriptionButtonTitle;
        }
      }

      this.setState({
        loading: false,
        inAppButtonTitle: inAppTitle,
        subscriptionButtonTitle: subscriptionButtonTitle,
        checkEntitlementsHidden: checkActiveEntitlementsButtonHidden,
      });
    });
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
              Qonversion.getSharedInstance().purchase('main').then(() => {
                this.setState({loading: false, subscriptionButtonTitle: 'Purchased'});
              }).catch(error => {
                this.setState({loading: false});

                if (!error.userCanceled) {
                  Alert.alert(
                    'Error',
                    error.message,
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: true}
                  );
                }
              });
            }}
          >
            <Text style={styles.buttonTitle}>{this.state.subscriptionButtonTitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inAppButton}
            onPress={() => {
              this.setState({loading: true});
              Qonversion.getSharedInstance().purchase('in_app').then(() => {
                this.setState({loading: false, inAppButtonTitle: 'Purchased'});
              }).catch(error => {
                this.setState({loading: false});

                if (!error.userCanceled) {
                  Alert.alert(
                    'Error',
                    error.message,
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: true}
                  );
                }
              });
            }}
          >
            <Text style={styles.inAppButtonTitle}>{this.state.inAppButtonTitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.additionalButton}
            onPress={() => {
              this.setState({loading: true});
              Qonversion.getSharedInstance().restore().then(entitlements => {
                this.setState({loading: false});

                let checkActiveEntitlementsButtonHidden = this.state.checkEntitlementsHidden;
                let inAppTitle = this.state.inAppButtonTitle;
                let subscriptionButtonTitle = this.state.subscriptionButtonTitle;
                if (entitlements.size > 0) {
                  const entitlementsValues = Array.from(entitlements.values());
                  checkActiveEntitlementsButtonHidden = entitlementsValues.some(item => item.isActive === true);

                  const standartEntitlement = entitlements.get('Test Entitlement');
                  if (standartEntitlement && standartEntitlement.isActive) {
                    inAppTitle = 'Restored';
                  }

                  const plusEntitlement = entitlements.get('plus');
                  if (plusEntitlement && plusEntitlement.isActive) {
                    subscriptionButtonTitle = 'Restored';
                  }
                } else {
                  Alert.alert(
                    'Error',
                    'No purchases to restore',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: true}
                  );
                }

                this.setState({
                  loading: false,
                  checkEntitlementsButtonHidden: checkActiveEntitlementsButtonHidden,
                  inAppButtonTitle: inAppTitle,
                  subscriptionButtonTitle: subscriptionButtonTitle,
                });
              });
            }}
          >
            <Text style={styles.additionalButtonsText}>Restore purchases</Text>
          </TouchableOpacity>
          {!this.state.checkEntitlementsHidden && <TouchableOpacity
            style={styles.additionalButton}
            onPress={() => {
              Qonversion.getSharedInstance().checkEntitlements().then(entitlements => {
                let message = '';
                const entitlementsValues = Array.from(entitlements.values());
                entitlementsValues.map((entitlement: Entitlement) => {
                  if (entitlement.isActive) {
                    message = message + 'entitlementID: ' + entitlement.id + '\n' + 'productID: ' + entitlement.productId + '\n' + 'renewState: ' + entitlement.renewState + '\n\n';
                  }
                });
                Alert.alert(
                  'Active entitlements',
                  message,
                  [
                    {text: 'OK'},
                  ],
                  {cancelable: true}
                );
              });
            }}
          >
            <Text style={styles.additionalButtonsText}>Check active entitlements</Text>
          </TouchableOpacity>
          }
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
