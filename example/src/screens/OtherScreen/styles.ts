import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 32,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  indicatorLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
    color: '#000000',
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  indicatorGray: {
    backgroundColor: '#cccccc',
  },
  indicatorGreen: {
    backgroundColor: '#34C759',
  },
  indicatorRed: {
    backgroundColor: '#FF3B30',
  },
  iosOnlyContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
});
