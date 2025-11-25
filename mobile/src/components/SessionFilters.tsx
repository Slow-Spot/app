import { logger } from '../utils/logger';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import theme from '../theme';

export interface FilterOptions {
  category: 'all' | 'traditional' | 'occasion' | 'cultural';
  occasion?: string;
  culture?: string;
  level?: number;
}

interface SessionFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const SessionFilters: React.FC<SessionFiltersProps> = ({ filters, onFiltersChange }) => {
  const { t } = useTranslation();

  const categories = [
    { key: 'all', label: t('sessions.filters.all') || 'All' },
    { key: 'traditional', label: t('sessions.categories.traditional') },
    { key: 'occasion', label: t('sessions.categories.occasion') },
    { key: 'cultural', label: t('sessions.categories.cultural') },
  ];

  const occasions = [
    'morning',
    'stress',
    'sleep',
    'focus',
    'anxiety',
    'grief',
    'gratitude',
    'creativity',
  ];

  const cultures = ['zen', 'vipassana', 'vedic', 'taoist', 'sufi', 'christian'];

  const levels = [1, 2, 3, 4, 5];

  const handleCategoryChange = (category: FilterOptions['category']) => {
    onFiltersChange({ ...filters, category, occasion: undefined, culture: undefined });
  };

  const handleOccasionChange = (occasion: string) => {
    onFiltersChange({
      ...filters,
      category: 'occasion',
      occasion: filters.occasion === occasion ? undefined : occasion,
    });
  };

  const handleCultureChange = (culture: string) => {
    onFiltersChange({
      ...filters,
      category: 'cultural',
      culture: filters.culture === culture ? undefined : culture,
    });
  };

  const handleLevelChange = (level: number) => {
    onFiltersChange({
      ...filters,
      level: filters.level === level ? undefined : level,
    });
  };

  return (
    <View style={styles.container}>
      {/* Main Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterRowContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.filterChip, filters.category === cat.key && styles.filterChipActive]}
            onPress={() => handleCategoryChange(cat.key as FilterOptions['category'])}
          >
            <Text
              style={[
                styles.filterChipText,
                filters.category === cat.key && styles.filterChipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Occasion Sub-Filter */}
      {filters.category === 'occasion' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subFilterRow}
          contentContainerStyle={styles.filterRowContent}
        >
          {occasions.map((occasion) => (
            <TouchableOpacity
              key={occasion}
              style={[
                styles.subFilterChip,
                filters.occasion === occasion && styles.subFilterChipActive,
              ]}
              onPress={() => handleOccasionChange(occasion)}
            >
              <Text
                style={[
                  styles.subFilterChipText,
                  filters.occasion === occasion && styles.subFilterChipTextActive,
                ]}
              >
                {t(`sessions.occasions.${occasion}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Culture Sub-Filter */}
      {filters.category === 'cultural' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subFilterRow}
          contentContainerStyle={styles.filterRowContent}
        >
          {cultures.map((culture) => (
            <TouchableOpacity
              key={culture}
              style={[
                styles.subFilterChip,
                filters.culture === culture && styles.subFilterChipActive,
              ]}
              onPress={() => handleCultureChange(culture)}
            >
              <Text
                style={[
                  styles.subFilterChipText,
                  filters.culture === culture && styles.subFilterChipTextActive,
                ]}
              >
                {t(`sessions.cultures.${culture}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Level Filter (always shown) */}
      <View style={styles.levelFilterContainer}>
        <Text style={styles.levelFilterLabel}>{t('meditation.level')}:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.levelFilterContent}
        >
          {levels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.levelChip, filters.level === level && styles.levelChipActive]}
              onPress={() => handleLevelChange(level)}
            >
              <Text
                style={[
                  styles.levelChipText,
                  filters.level === level && styles.levelChipTextActive,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  filterRow: {
    paddingHorizontal: theme.spacing.sm,
  },
  filterRowContent: {
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  filterChipActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterChipText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: '#667eea',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  subFilterRow: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  subFilterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  subFilterChipActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderColor: '#667eea',
  },
  subFilterChipText: {
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.medium,
    color: '#667eea',
  },
  subFilterChipTextActive: {
    color: '#667eea',
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  levelFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(102, 126, 234, 0.1)',
  },
  levelFilterLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
  levelFilterContent: {
    gap: theme.spacing.xs,
  },
  levelChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelChipActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  levelChipText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: '#667eea',
  },
  levelChipTextActive: {
    color: '#ffffff',
  },
});
