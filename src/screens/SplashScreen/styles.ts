import { StyleSheet } from 'react-native';

const colors = {
  background: '#2B0055',
  primary: '#F7F4EC',
  primarySoft: '#E8DFFF',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  screen: {
    flex: 1,
    paddingHorizontal: 28,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    position: 'absolute',
    left: 28,
    right: 28,
    bottom: 54,
    alignItems: 'center',
  },

  loadingTrack: {
    width: 132,
    height: 5,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
  },

  loadingFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
});

export default styles;