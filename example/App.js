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
  QonversionConfigBuilder,
  LaunchMode,
  Environment,
  EntitlementsCacheLifetime,
} from 'react-native-qonversion';
import { NoCodes, NoCodesConfigBuilder } from 'react-native-qonversion';

const ProjectKey = 'PV77YHL7qnGvsdmpTs7gimsxUvY-Znl2';
const InAppProductId = 'in_app';
const SubscriptionProductId = 'weekly';
const NoCodeScreenContextKey = 'kamo_test';

export class QonversionSample extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      inAppButtonTitle: 'Loading...',
      subscriptionButtonTitle: 'Loading...',
      loading: true,
      checkEntitlementsHidden: true,
      subscriptionProduct: null,
      inAppProduct: null,
    };

    // eslint-disable-next-line consistent-this
    const outerClassRef = this; // necessary for anonymous classes to access this.
    const config = new QonversionConfigBuilder(ProjectKey, LaunchMode.SUBSCRIPTION_MANAGEMENT)
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

    // Initialize NoCodes
    const noCodesConfig = new NoCodesConfigBuilder(ProjectKey)
      .setNoCodesListener({
        onScreenShown: (id) => {
          console.log('No-Codes screen shown:', id);
        },
        onActionStartedExecuting: (action) => {
          console.log('No-Codes starts executing action:', action);
        },
        onActionFailedToExecute: (action, error) => {
          console.log('No-Codes failed to execute action:', action, error);
        },
        onActionFinishedExecuting: (action) => {
          console.log('No-Codes finished executing action:', action);
        },
        onFinished: () => {
          console.log('No-Codes flow finished');
        },
        onScreenFailedToLoad: (error) => {
          console.log('No-Codes failed to load screen:', error);
          NoCodes.getSharedInstance().close();
        }
      })
      .build();
    NoCodes.initialize(noCodesConfig);

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

      const inApp = products.get(InAppProductId);
      if (inApp) {
        inAppTitle = 'Buy for ' + inApp.prettyPrice;

        const entitlement = entitlements.get('Test Entitlement');
        if (entitlement) {
          inAppTitle = entitlement.isActive ? 'Purchased' : inAppTitle;
        }
      }

      const subscription = products.get(SubscriptionProductId);
      if (subscription) {
        subscriptionButtonTitle = 'Subscribe for '
          + subscription.prettyPrice
          + ' / '
          + subscription.subscriptionPeriod.unitCount
          + ' '
          + subscription.subscriptionPeriod.unit;

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
        subscriptionProduct: subscription,
        inAppProduct: inApp,
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
          source={require('./assets/q_icon.png')}
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
              if (!this.state.subscriptionProduct) {
                Alert.alert(
                  'Error',
                  'Purchasing product not found - id ' + SubscriptionProductId,
                  [
                    {text: 'OK'},
                  ],
                  {cancelable: true}
                );
                return;
              }
              this.setState({loading: true});
              Qonversion.getSharedInstance().purchaseProduct(this.state.subscriptionProduct).then(() => {
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
              if (!this.state.inAppProduct) {
                Alert.alert(
                  'Error',
                  'Purchasing product not found - id ' + InAppProductId,
                  [
                    {text: 'OK'},
                  ],
                  {cancelable: true}
                );
                return;
              }
              this.setState({loading: true});
              Qonversion.getSharedInstance().purchaseProduct(this.state.inAppProduct).then(() => {
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
                  inAppButtonTitle: inAppTitle,
                  subscriptionButtonTitle: subscriptionButtonTitle,
                  checkEntitlementsHidden: checkActiveEntitlementsButtonHidden,
                });
              }).catch(error => {
                this.setState({loading: false});
                Alert.alert(
                  'Error',
                  error.message,
                  [
                    {text: 'OK'},
                  ],
                  {cancelable: true}
                );
              });
            }}
          >
            <Text style={styles.additionalButtonsText}>Restore purchases</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.additionalButton, {opacity: this.state.checkEntitlementsHidden ? 0.5 : 1}]}
            onPress={() => {
              if (this.state.checkEntitlementsHidden) {
                return;
              }
              this.setState({loading: true});
              Qonversion.getSharedInstance().checkEntitlements().then(entitlements => {
                this.setState({loading: false});
                if (entitlements.size > 0) {
                  const entitlementsValues = Array.from(entitlements.values());
                  const activeEntitlements = entitlementsValues.filter(item => item.isActive === true);
                  if (activeEntitlements.length > 0) {
                    Alert.alert(
                      'Active entitlements',
                      activeEntitlements.map(item => item.entitlementId).join('\n'),
                      [
                        {text: 'OK'},
                      ],
                      {cancelable: true}
                    );
                  } else {
                    Alert.alert(
                      'Active entitlements',
                      'No active entitlements',
                      [
                        {text: 'OK'},
                      ],
                      {cancelable: true}
                    );
                  }
                } else {
                  Alert.alert(
                    'Active entitlements',
                    'No entitlements',
                    [
                      {text: 'OK'},
                    ],
                    {cancelable: true}
                  );
                }
              }).catch(error => {
                this.setState({loading: false});
                Alert.alert(
                  'Error',
                  error.message,
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
          <TouchableOpacity
            style={styles.additionalButton}
            onPress={() => {
              NoCodes.getSharedInstance().showScreen(NoCodeScreenContextKey)
            }}
          >
            <Text style={styles.additionalButtonsText}>Show NoCodes Screen</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subscriptionButton: {
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inAppButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f0f0f',
  },
  additionalButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f0f0f',
  },
  buttonTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  inAppButtonTitle: {
    color: '#0f0f0f',
    fontSize: 17,
    fontWeight: '600',
  },
  additionalButtonsText: {
    color: '#0f0f0f',
    fontSize: 17,
    fontWeight: '600',
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
