/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet, Text, View, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Qonversion, {Product, Permission} from 'react-native-qonversion';

type StateType = {
    inAppButtonTitle: string;
    subscriptionButtonTitle: string;
    loading: boolean;
    checkPermissionsHidden: boolean;
};

const prettyDuration = {
    'WEEKLY': 'weekly',
    'MONTHLY': 'monthly',
    '3_MONTHS': '3 months',
    '6_MONTHS': '6 months',
    'ANNUAL': 'annual',
    'LIFETIME': 'lifetime',
};

export class QonversionSample extends React.PureComponent<{}, StateType> {
    constructor(props) {
        super(props);

        this.state = {
            inAppButtonTitle: "Loading...",
            subscriptionButtonTitle: "Loading...",
            loading: true,
            checkPermissionsHidden: true,
        };

        Qonversion.launchWithKey('PV77YHL7qnGvsdmpTs7gimsxUvY-Znl2');
        Qonversion.checkPermissions().then(permissions => {
            let checkActivePermissionsButtonHidden = this.state.checkPermissionsHidden;
            if (permissions.size > 0) {
                const permissionsValues = Array.from(permissions.values());
                checkActivePermissionsButtonHidden = !permissionsValues.some(item => item.isActive === true);
            }
            Qonversion.products().then(products => {
                let inAppTitle = this.state.inAppButtonTitle;
                let subscriptionButtonTitle = this.state.subscriptionButtonTitle;

                const inApp: Product = products.get('in_app');
                if (inApp) {
                    inAppTitle = 'Buy for ' + inApp.prettyPrice;
                    const permission = permissions.get('Test Permission');
                    if (permission) {
                        inAppTitle = permission.isActive ? 'Purchased' : inAppTitle;
                    }
                }

                const main: Product = products.get('main');
                if (main) {
                    subscriptionButtonTitle = 'Subscribe for ' + main.prettyPrice + ' / ' + prettyDuration[main.duration];
                    const permission = permissions.get('plus');
                    if (permission) {
                        subscriptionButtonTitle = permission.isActive ? 'Purchased' : subscriptionButtonTitle;
                    }
                }

                this.setState({
                    loading: false,
                    inAppButtonTitle: inAppTitle,
                    subscriptionButtonTitle: subscriptionButtonTitle,
                    checkPermissionsHidden: checkActivePermissionsButtonHidden,
                });
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
          <ActivityIndicator size="small" color="#0f0f0f" />
          }
          <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 64, marginTop: 10}}>
              <Text style={{fontSize: 15, fontWeight: '500', alignSelf: 'center', textAlign: 'center'}}>Start with 3 days free trial</Text>
              <TouchableOpacity
                  style={styles.subscriptionButton}
                  onPress={() => {
                      this.setState({loading: true});
                      Qonversion.purchase('main').then(() => {
                          this.setState({loading: false, subscriptionButtonTitle: 'Purchased'});
                      }).catch(error => {
                          this.setState({loading: false});

                          if (!error.userCanceled) {
                              Alert.alert(
                                  'Error',
                                  error.message,
                                  [
                                      { text: 'OK' },
                                  ],
                                  { cancelable: true }
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
                      Qonversion.purchase('in_app').then(() => {
                          this.setState({loading: false, inAppButtonTitle: 'Purchased'});
                      }).catch(error => {
                          this.setState({loading: false});

                          if (!error.userCanceled) {
                              Alert.alert(
                                  'Error',
                                  error.message,
                                  [
                                      { text: 'OK' },
                                  ],
                                  { cancelable: true }
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
                      Qonversion.restore().then(permissions => {
                          this.setState({loading: false});

                          let checkActivePermissionsButtonHidden = this.state.checkPermissionsHidden;
                          let inAppTitle = this.state.inAppButtonTitle;
                          let subscriptionButtonTitle = this.state.subscriptionButtonTitle;
                          if (permissions.size > 0) {
                              const permissionsValues = Array.from(permissions.values());
                              checkActivePermissionsButtonHidden = permissionsValues.some(item => item.isActive === true);

                              const standartPermission = permissions.get('Test Permission');
                              if (standartPermission && standartPermission.isActive) {
                                  inAppTitle = 'Restored';
                              }

                              const plusPermission = permissions.get('plus');
                              if (plusPermission && plusPermission.isActive) {
                                  subscriptionButtonTitle = 'Restored';
                              }
                          } else {
                              Alert.alert(
                                  'Error',
                                  'No purchases to restore',
                                  [
                                      { text: 'OK' }
                                  ],
                                  { cancelable: true }
                              );
                          }

                          this.setState({loading: false, checkPermissionsButtonHidden: checkActivePermissionsButtonHidden, inAppButtonTitle: inAppTitle,
                              subscriptionButtonTitle: subscriptionButtonTitle});

                          // if let permission: Qonversion.Permission = self.permissions["plus"], permission.isActive {
                          //     self.mainProductSubscriptionButton.setTitle("Restored", for: .normal)
                          // }
                      });
                  }}
              >
                  <Text style={styles.additionalButtonsText}>Restore purchases</Text>
              </TouchableOpacity>
              {!this.state.checkPermissionsHidden && <TouchableOpacity
                  style={styles.additionalButton}
                  onPress={() => {
                      Qonversion.checkPermissions().then(permissions => {
                          let message = '';
                          const permissionsValues = Array.from(permissions.values());
                          permissionsValues.map((permission: Permission) => {
                              if (permission.isActive) {
                                  message = message + 'permissionID: ' + permission.permissionID + '\n' + 'productID: ' + permission.productID + '\n' + 'renewState: ' + permission.renewState + '\n\n';
                              }
                          });
                          Alert.alert(
                              'Active permissions',
                              message,
                              [
                                  { text: 'OK' }
                              ],
                              { cancelable: true }
                          );
                      });
                  }}
              >
                  <Text style={styles.additionalButtonsText}>Check active permissions</Text>
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
        textAlign:'center',
    },
    additionalButton: {
        flexDirection: 'row',
        height: 40,
        marginHorizontal:32,
        alignItems: 'center',
    },
    subscriptionButton: {
        flexDirection: 'row',
        marginHorizontal:32,
        height: 54,
        marginTop:10,
        backgroundColor:'#3E5AE1',
        borderRadius:20,
        borderWidth: 1,
        borderColor: '#3E5AE1',
        alignItems: 'center',
    },
    inAppButton: {
        flexDirection: 'row',
        marginHorizontal:32,
        height: 54,
        marginTop:10,
        borderRadius:20,
        borderWidth: 1,
        borderColor: '#3E5AE1',
        alignItems: 'center',
    },
    inAppButtonTitle: {
        flex: 1,
        textAlign:'center',
        color: '#3E5AE1',
    },
    buttonTitle: {
        flex: 1,
        color:'#fff',
        textAlign:'center',
    },
});
export default class App extends Component {
  render() {
    return (
      <>
        <SafeAreaView style={{flex: 1}}>
          <QonversionSample />
        </SafeAreaView>
      </>
    );
  }
}
