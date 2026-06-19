import { StyleSheet } from 'react-native';

export const colors = {
  background: '#2B0055',
  primary: '#F7F4EC',
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

});

export default styles;