import { observer } from 'mobx-react-lite';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../theme';
import type { FeedTierFilter } from '../../types/api';

type FilterTabsProps = {
  value: FeedTierFilter;
  onChange: (value: FeedTierFilter) => void;
};

const FILTER_ITEMS: Array<{ label: string; value: FeedTierFilter }> = [
  { label: 'Все', value: 'all' },
  { label: 'Бесплатные', value: 'free' },
  { label: 'Платные', value: 'paid' },
];

export const FilterTabs = observer(function FilterTabs({ value, onChange }: FilterTabsProps) {
  return (
    <View style={styles.container}>
      {FILTER_ITEMS.map((item) => {
        const isActive = item.value === value;

        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F4',
    borderRadius: theme.radius.pill,
    padding: 4,
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    borderRadius: theme.radius.pill,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  activeTab: {
    backgroundColor: theme.semantic.primary,
  },
  label: {
    color: theme.semantic.textMuted,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  activeLabel: {
    color: theme.colors.white,
  },
});
