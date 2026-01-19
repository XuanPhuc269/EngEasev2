'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Chip,
  Collapse,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  Close,
} from '@mui/icons-material';
import { useDebounce } from '@/hooks/useDebounce';

export interface FilterOption {
  label: string;
  value: string;
}

export interface SearchFilter {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
}

interface SearchBarProps {
  /**
   * Placeholder text for search input
   * @default 'Tìm kiếm...'
   */
  placeholder?: string;
  /**
   * Callback when search value changes (debounced)
   */
  onSearch?: (value: string) => void;
  /**
   * Callback when search value changes (immediate)
   */
  onChange?: (value: string) => void;
  /**
   * Controlled value
   */
  value?: string;
  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceDelay?: number;
  /**
   * Initial search value
   */
  defaultValue?: string;
  /**
   * Whether to show clear button
   * @default true
   */
  showClearButton?: boolean;
  /**
   * Filter options
   */
  filters?: SearchFilter[];
  /**
   * Callback when filters change
   */
  onFilterChange?: (filters: Record<string, string>) => void;
  /**
   * Whether search is loading
   * @default false
   */
  loading?: boolean;
  /**
   * Size of search input
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  /**
   * Full width
   * @default true
   */
  fullWidth?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Tìm kiếm...',
  onSearch,
  onChange,
  value: controlledValue,
  debounceDelay = 300,
  defaultValue = '',
  showClearButton = true,
  filters,
  onFilterChange,
  loading = false,
  size = 'medium',
  fullWidth = true,
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const searchValue = isControlled ? controlledValue : internalValue;
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    filters?.reduce((acc, filter) => ({ ...acc, [filter.key]: filter.value }), {}) || {}
  );

  // Debounce search
  const debouncedSearch = useDebounce(searchValue, debounceDelay);

  // Effect to trigger search when debounced value changes
  React.useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, onSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    
    // Update internal state if not controlled
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    // Call onChange immediately if provided
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  }, [isControlled, onChange, onSearch]);

  const handleFilterChange = (key: string) => (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    const newFilterValues = { ...filterValues, [key]: newValue };
    setFilterValues(newFilterValues);
    onFilterChange?.(newFilterValues);
  };

  const handleClearFilter = (key: string) => () => {
    const newFilterValues = { ...filterValues, [key]: '' };
    setFilterValues(newFilterValues);
    onFilterChange?.(newFilterValues);
  };

  const handleClearAllFilters = () => {
    const clearedFilters = Object.keys(filterValues).reduce(
      (acc, key) => ({ ...acc, [key]: '' }),
      {}
    );
    setFilterValues(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const activeFiltersCount = Object.values(filterValues).filter(Boolean).length;

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: 0.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            size={size}
            placeholder={placeholder}
            value={searchValue}
            onChange={handleSearchChange}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {showClearButton && searchValue && (
                    <IconButton size="small" onClick={handleClear}>
                      <Clear fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
              sx: {
                '& fieldset': { border: 'none' },
              },
            }}
          />

          {filters && filters.length > 0 && (
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              color={activeFiltersCount > 0 ? 'primary' : 'default'}
              sx={{ position: 'relative' }}
            >
              <FilterList />
              {activeFiltersCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeFiltersCount}
                </Box>
              )}
            </IconButton>
          )}
        </Box>
      </Paper>

      {/* Filters Panel */}
      {filters && filters.length > 0 && (
        <Collapse in={showFilters}>
          <Paper
            elevation={0}
            sx={{
              mt: 1,
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                alignItems: 'flex-end',
              }}
            >
              {filters.map((filter) => (
                <FormControl key={filter.key} size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>{filter.label}</InputLabel>
                  <Select
                    value={filterValues[filter.key] || ''}
                    onChange={handleFilterChange(filter.key)}
                    label={filter.label}
                  >
                    <MenuItem value="">
                      <em>Tất cả</em>
                    </MenuItem>
                    {filter.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}

              {activeFiltersCount > 0 && (
                <Button
                  size="small"
                  color="error"
                  startIcon={<Close />}
                  onClick={handleClearAllFilters}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </Box>

            {/* Active Filters Chips */}
            {activeFiltersCount > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {filters.map((filter) => {
                  const value = filterValues[filter.key];
                  if (!value) return null;
                  const option = filter.options.find((o) => o.value === value);
                  return (
                    <Chip
                      key={filter.key}
                      label={`${filter.label}: ${option?.label || value}`}
                      onDelete={handleClearFilter(filter.key)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  );
                })}
              </Box>
            )}
          </Paper>
        </Collapse>
      )}
    </Box>
  );
};

export default SearchBar;
