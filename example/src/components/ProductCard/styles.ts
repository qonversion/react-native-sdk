import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  listItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
});
