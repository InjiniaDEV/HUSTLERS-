import { StyleSheet } from 'react-native';
import { colors, spacing, radius } from './tokens';

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: spacing.lg,
  },
  hero: {
    backgroundColor: colors.sky,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.ocean,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  buttonPrimary: {
    backgroundColor: colors.ocean,
    borderRadius: radius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonPrimaryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  buttonSecondary: {
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonSecondaryText: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 15,
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.sm,
  },
});
