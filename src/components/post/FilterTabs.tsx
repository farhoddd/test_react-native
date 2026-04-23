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
            style={({ pressed }) => [styles.tab, isActive && styles.activeTab, pressed && !isActive && styles.tabPressed]}
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
    backgroundColor: theme.colors.white,
    borderRadius: 22,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E8E8ED',
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    minHeight: 38,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#6115CD',
  },
  tabPressed: {
    backgroundColor: '#F4F1FA',
  },
  label: {
    color: '#677487',
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  activeLabel: {
    color: theme.colors.white,
  },
});
