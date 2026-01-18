'use client';

import React from 'react';
import {
  Box,
  Pagination as MuiPagination,
  PaginationItem,
  Typography,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface PaginationProps {
  /**
   * Current page (1-indexed)
   */
  page: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Total number of items
   */
  totalItems?: number;
  /**
   * Number of items per page
   */
  pageSize?: number;
  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Available page size options
   * @default [10, 20, 50, 100]
   */
  pageSizeOptions?: number[];
  /**
   * Whether to show page size selector
   * @default true
   */
  showPageSizeSelector?: boolean;
  /**
   * Whether to show item count info
   * @default true
   */
  showItemCount?: boolean;
  /**
   * Size of pagination
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Color of pagination
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'standard';
  /**
   * Shape of pagination items
   * @default 'rounded'
   */
  shape?: 'rounded' | 'circular';
  /**
   * Whether pagination is disabled
   * @default false
   */
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showItemCount = true,
  size = 'medium',
  color = 'primary',
  shape = 'rounded',
  disabled = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    onPageChange(newPage);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = event.target.value as number;
    onPageSizeChange?.(newSize);
    // Reset to first page when changing page size
    onPageChange(1);
  };

  // Calculate item range
  const startItem = totalItems ? (page - 1) * pageSize + 1 : 0;
  const endItem = totalItems ? Math.min(page * pageSize, totalItems) : 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        py: 2,
        flexWrap: 'wrap',
      }}
    >
      {/* Item count info */}
      {showItemCount && totalItems !== undefined && (
        <Typography variant="body2" color="text.secondary">
          Hiển thị {startItem} - {endItem} trong tổng số {totalItems} kết quả
        </Typography>
      )}

      {/* Pagination controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* Page size selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Hiển thị
            </Typography>
            <FormControl size="small">
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={disabled}
                sx={{
                  minWidth: 70,
                  '& .MuiSelect-select': {
                    py: 0.5,
                  },
                }}
              >
                {pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              / trang
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        <MuiPagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          disabled={disabled}
          color={color}
          size={size}
          shape={shape}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={isMobile ? 1 : 2}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBack, next: ArrowForward }}
              {...item}
            />
          )}
          sx={{
            '& .MuiPagination-ul': {
              flexWrap: 'nowrap',
            },
            '& .MuiPaginationItem-root': {
              fontWeight: 500,
            },
            '& .Mui-selected': {
              fontWeight: 700,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Pagination;
