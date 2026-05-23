import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F7F4EC',
  surface: '#FFFFFF',
  primary: '#2B0055',
  primaryBright: '#3A0EC6',
  primarySoft: '#EFE7FF',
  primarySoftStrong: '#E0D1FF',
  text: '#10162F',
  textMuted: '#4F5878',
  textSoft: '#7C829A',
  border: '#ECE8DF',
  green: '#23B24B',
  warning: '#F5A623',
  yellow: '#F3B512',
  white: '#FFFFFF',
  danger: '#C0392B',
};

const shadow = {
  shadowColor: '#1E1230',
  shadowOpacity: 0.08,
  shadowRadius: 18,
  shadowOffset: {
    width: 0,
    height: 8,
  },
  elevation: 4,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 120,
  },

  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    color: colors.primaryBright,
    fontSize: 34,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -2,
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    ...shadow,
  },

  hero: {
    marginTop: 20,
  },

  title: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.2,
  },

  subtitle: {
    width: '78%',
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 25,
  },

  segmentedControl: {
    height: 70,
    marginTop: 28,
    padding: 9,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    ...shadow,
  },

  segmentButton: {
    flex: 1,
    height: '100%',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  segmentButtonActive: {
    backgroundColor: colors.primaryBright,
  },

  segmentText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },

  segmentTextActive: {
    color: colors.white,
  },

  sectionHeader: {
    marginTop: 28,
    marginBottom: 16,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  editButton: {
    height: 42,
    paddingHorizontal: 17,
    borderRadius: 18,
    borderWidth: 1.4,
    borderColor: colors.primaryBright,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.surface,
  },

  editButtonText: {
    color: colors.primaryBright,
    fontSize: 15,
    fontWeight: '800',
  },

  cardsList: {
    gap: 14,
  },

  stationCard: {
    minHeight: 154,
    padding: 18,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  stationCardPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  cardIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },

  cardContent: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 8,
  },

  stationName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 21,
  },

  stationAddress: {
    marginTop: 5,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },

  statusRow: {
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.green,
  },

  statusDotWarning: {
    backgroundColor: colors.warning,
  },

  statusText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },

  amenitiesRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  amenityCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F1F4',
  },

  cardMeta: {
    minWidth: 92,
    alignItems: 'flex-end',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  distanceText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },

  ratingText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
  },

  powerRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  powerText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },

  providerTag: {
    marginTop: 15,
    paddingHorizontal: 10,
    height: 31,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DFF4D8',
  },

  providerTagText: {
    color: '#1C7C32',
    fontSize: 14,
    fontWeight: '800',
  },

  removeButton: {
    marginTop: 14,
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE8E4',
  },

  removeButtonText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '800',
  },

  emptyCard: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },

  emptyTitle: {
    marginTop: 18,
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },

  emptyText: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
  },

  emptyButton: {
    height: 48,
    marginTop: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryBright,
  },

  emptyButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },

  tabBar: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 8,
    height: 86,
    paddingHorizontal: 8,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  activeTabIndicator: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primaryBright,
  },

  tabLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },

  tabLabelActive: {
    color: colors.primaryBright,
    fontWeight: '800',
  },

  activityIconCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;