'use client';

import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import { TestType, Difficulty } from '@/types';

export interface TestFilterValues {
  type?: TestType | 'all';
  difficulty?: Difficulty | 'all';
  isPublished?: boolean | 'all';
}

interface TestFilterProps {
  filters: TestFilterValues;
  onFilterChange: (filters: TestFilterValues) => void;
  showPublishedFilter?: boolean;
}

const TestFilter: React.FC<TestFilterProps> = ({
  filters,
  onFilterChange,
  showPublishedFilter = false,
}) => {
  const handleTypeChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    onFilterChange({
      ...filters,
      type: value === 'all' ? undefined : (value as TestType),
    });
  };

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    onFilterChange({
      ...filters,
      difficulty: value === 'all' ? undefined : (value as Difficulty),
    });
  };

  const handlePublishedChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    onFilterChange({
      ...filters,
      isPublished: value === 'all' ? undefined : value === 'true',
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      type: undefined,
      difficulty: undefined,
      isPublished: undefined,
    });
  };

  const activeFiltersCount = [
    filters.type,
    filters.difficulty,
    filters.isPublished,
  ].filter((f) => f !== undefined && f !== 'all').length;

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        {/* Type Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Loại bài thi</InputLabel>
          <Select
            value={filters.type || 'all'}
            label="Loại bài thi"
            onChange={handleTypeChange}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value={TestType.LISTENING}>Listening</MenuItem>
            <MenuItem value={TestType.READING}>Reading</MenuItem>
            <MenuItem value={TestType.WRITING}>Writing</MenuItem>
            <MenuItem value={TestType.SPEAKING}>Speaking</MenuItem>
            <MenuItem value={TestType.FULL_TEST}>Full Test</MenuItem>
          </Select>
        </FormControl>

        {/* Difficulty Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Độ khó</InputLabel>
          <Select
            value={filters.difficulty || 'all'}
            label="Độ khó"
            onChange={handleDifficultyChange}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value={Difficulty.BEGINNER}>Cơ bản</MenuItem>
            <MenuItem value={Difficulty.INTERMEDIATE}>Trung bình</MenuItem>
            <MenuItem value={Difficulty.ADVANCED}>Nâng cao</MenuItem>
          </Select>
        </FormControl>

        {/* Published Filter (Admin/Teacher only) */}
        {showPublishedFilter && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={
                filters.isPublished === undefined
                  ? 'all'
                  : filters.isPublished.toString()
              }
              label="Trạng thái"
              onChange={handlePublishedChange}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="true">Đã xuất bản</MenuItem>
              <MenuItem value="false">Chưa xuất bản</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Clear Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Clear />}
            onClick={handleClearFilters}
            sx={{ minWidth: 120 }}
          >
            Xóa bộ lọc
          </Button>
        )}
      </Stack>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <FilterList fontSize="small" color="action" />
          {filters.type && (
            <Chip
              label={`Loại: ${filters.type}`}
              size="small"
              onDelete={() => handleTypeChange({ target: { value: 'all' } } as SelectChangeEvent)}
            />
          )}
          {filters.difficulty && (
            <Chip
              label={`Độ khó: ${filters.difficulty}`}
              size="small"
              onDelete={() => handleDifficultyChange({ target: { value: 'all' } } as SelectChangeEvent)}
            />
          )}
          {filters.isPublished !== undefined && (
            <Chip
              label={filters.isPublished ? 'Đã xuất bản' : 'Chưa xuất bản'}
              size="small"
              onDelete={() => handlePublishedChange({ target: { value: 'all' } } as SelectChangeEvent)}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default TestFilter;