import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import styles from './styles';

interface EntitlementDetailScreenProps {
  entitlement: any;
}

const EntitlementDetailScreen: React.FC<EntitlementDetailScreenProps> = ({
  entitlement,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderField = (label: string, value: any) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}:</Text>
        <Text style={styles.fieldValue}>
          {value !== null && value !== undefined ? String(value) : '-'}
        </Text>
      </View>
    );
  };

  const renderDateField = (label: string, date: Date | undefined) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}:</Text>
        <Text style={styles.fieldValue}>{date ? formatDate(date) : '-'}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{entitlement.id}</Text>
        <View
          style={[
            styles.statusBadge,
            entitlement.isActive ? styles.statusActive : styles.statusInactive,
          ]}
        >
          <Text style={styles.statusText}>
            {entitlement.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        {renderField('ID', entitlement.id)}
        {renderField('Product ID', entitlement.productId)}
        {renderField('Renew State', entitlement.renewState)}
        {renderField('Source', entitlement.source)}
        {renderField('Grant Type', entitlement.grantType)}
        {renderField('Renews Count', entitlement.renewsCount)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dates</Text>
        {renderDateField('Started Date', entitlement.startedDate)}
        {renderDateField('Expiration Date', entitlement.expirationDate)}
        {renderDateField('Trial Start Date', entitlement.trialStartDate)}
        {renderDateField('First Purchase Date', entitlement.firstPurchaseDate)}
        {renderDateField('Last Purchase Date', entitlement.lastPurchaseDate)}
        {renderDateField(
          'Auto Renew Disable Date',
          entitlement.autoRenewDisableDate
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        {renderField(
          'Last Activated Offer Code',
          entitlement.lastActivatedOfferCode
        )}
        {entitlement.transactions && entitlement.transactions.length > 0 && (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Transactions:</Text>
            <Text style={styles.fieldValue}>
              {entitlement.transactions.length} transaction(s)
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default EntitlementDetailScreen;
