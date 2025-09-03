import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  userInfoContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  userInfoText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    marginBottom: 8,
    width: '100%',
  },
  userInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  userInfoValue: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
    marginRight: 8,
    flexWrap: 'wrap',
  },
});
