import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';
import { User } from '@qonversion/react-native-sdk';
import styles from './styles';

interface UserInfoSectionProps {
  userInfo: User | null;
  title?: string;
  showCopyButtons?: boolean;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  userInfo,
  title = 'User Information:',
  showCopyButtons = true,
}) => {
  if (!userInfo) {
    return null;
  }

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Snackbar.show({
      text: `${label} copied to clipboard`,
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  return (
    <View style={styles.userInfoContainer}>
      <Text style={styles.userInfoTitle}>{title}</Text>

      {showCopyButtons ? (
        <>
          <TouchableOpacity
            style={styles.userInfoRow}
            onPress={() =>
              copyToClipboard(userInfo?.qonversionId || '', 'Qonversion ID')
            }
          >
            <Text style={styles.userInfoLabel}>Qonversion ID:</Text>
            <Text style={styles.userInfoValue}>
              {userInfo?.qonversionId || 'Not available'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.userInfoRow}
            onPress={() =>
              copyToClipboard(userInfo?.identityId || '', 'Identity ID')
            }
          >
            <Text style={styles.userInfoLabel}>Identity ID:</Text>
            <Text style={styles.userInfoValue}>
              {userInfo?.identityId || 'Anonymous'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.userInfoText}>
            ID: {userInfo?.identityId || 'Anonymous'}
          </Text>
          <Text style={styles.userInfoText}>
            Qonversion ID: {userInfo?.qonversionId || 'Not available'}
          </Text>
        </>
      )}
    </View>
  );
};

export default UserInfoSection;
