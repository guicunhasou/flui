import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F7F4EC',
  surface: '#FFFFFF',
  primary: '#2B0055',
  primaryBright: '#3A0EC6',
  primarySoft: '#EFE7FF',
  text: '#10162F',
  textMuted: '#4F5878',
  textSoft: '#7C829A',
  border: '#ECE8DF',
  green: '#23B24B',
  greenSoft: '#DFF4D8',
  yellow: '#F3B512',
  white: '#FFFFFF',
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
    paddingBottom: 122,
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
    marginTop: 18,
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
    height: 68,
    marginTop: 26,
    padding: 8,
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
    fontSize: 15,
    fontWeight: '800',
  },

  segmentTextActive: {
    color: colors.white,
  },

  sectionHeader: {
    marginTop: 28,
    marginBottom: 14,
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.1,
  },

  viewAllText: {
    color: colors.primaryBright,
    fontSize: 15,
    fontWeight: '800',
  },

  historyList: {
    gap: 10,
  },

  historyCard: {
    minHeight: 118,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  cardIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },

  historyContent: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 8,
  },

  historyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },

  historyAddress: {
    marginTop: 5,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },

  dateRow: {
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },

  dateText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },

  historyMeta: {
    width: 70,
    alignItems: 'flex-end',
    gap: 10,
  },

  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metaText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },

  cardActionArea: {
    width: 82,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },

  doneTag: {
    minHeight: 27,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.greenSoft,
  },

  doneTagText: {
    color: '#1C7C32',
    fontSize: 11,
    fontWeight: '900',
  },

  reviewButton: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  reviewButtonText: {
    color: colors.primaryBright,
    fontSize: 15,
    fontWeight: '900',
  },

  reviewsBox: {
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  reviewRow: {
    minHeight: 62,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  reviewIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },

  reviewContent: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 8,
  },

  reviewTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },

  reviewDate: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },

  reviewRating: {
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  reviewRatingText: {
    color: colors.textMuted,
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

  activityIconCircleActive: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primaryBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;