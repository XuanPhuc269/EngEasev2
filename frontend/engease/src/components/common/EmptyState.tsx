'use client';

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import {
  Inbox,
  Search,
  Assignment,
  Error,
  CloudOff,
  Wifi,
  Add,
} from '@mui/icons-material';

type EmptyStateType =
  | 'no-data'
  | 'no-results'
  | 'no-tests'
  | 'error'
  | 'offline'
  | 'no-connection'
  | 'custom';

interface EmptyStateProps {
  /**
   * Type of empty state - determines icon and default message
   * @default 'no-data'
   */
  type?: EmptyStateType;
  /**
   * Custom title
   */
  title?: string;
  /**
   * Custom description
   */
  description?: string;
  /**
   * Custom icon component
   */
  icon?: React.ReactNode;
  /**
   * Action button text
   */
  actionText?: string;
  /**
   * Callback when action button is clicked
   */
  onAction?: () => void;
  /**
   * Secondary action button text
   */
  secondaryActionText?: string;
  /**
   * Callback when secondary action button is clicked
   */
  onSecondaryAction?: () => void;
  /**
   * Image URL to display instead of icon
   */
  imageUrl?: string;
  /**
   * Size of the empty state
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to show paper background
   * @default false
   */
  paper?: boolean;
}

const typeConfig: Record<
  Exclude<EmptyStateType, 'custom'>,
  {
    icon: React.ElementType;
    title: string;
    description: string;
    iconColor: string;
    bgColor: string;
  }
> = {
  'no-data': {
    icon: Inbox,
    title: 'Chưa có dữ liệu',
    description: 'Hiện tại chưa có dữ liệu nào để hiển thị.',
    iconColor: 'grey.400',
    bgColor: 'grey.100',
  },
  'no-results': {
    icon: Search,
    title: 'Không tìm thấy kết quả',
    description: 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn.',
    iconColor: 'info.main',
    bgColor: 'info.lighter',
  },
  'no-tests': {
    icon: Assignment,
    title: 'Chưa có bài test nào',
    description: 'Bắt đầu tạo bài test đầu tiên của bạn ngay bây giờ.',
    iconColor: 'primary.main',
    bgColor: 'primary.lighter',
  },
  error: {
    icon: Error,
    title: 'Đã xảy ra lỗi',
    description: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
    iconColor: 'error.main',
    bgColor: 'error.lighter',
  },
  offline: {
    icon: CloudOff,
    title: 'Không có kết nối',
    description: 'Bạn đang ở chế độ offline. Hãy kiểm tra kết nối internet.',
    iconColor: 'warning.main',
    bgColor: 'warning.lighter',
  },
  'no-connection': {
    icon: Wifi,
    title: 'Mất kết nối',
    description: 'Không thể kết nối đến server. Vui lòng thử lại.',
    iconColor: 'error.main',
    bgColor: 'error.lighter',
  },
};

const sizeConfig = {
  small: {
    iconSize: 48,
    spacing: 2,
    titleVariant: 'subtitle1' as const,
    descVariant: 'body2' as const,
    maxWidth: 280,
  },
  medium: {
    iconSize: 80,
    spacing: 3,
    titleVariant: 'h6' as const,
    descVariant: 'body1' as const,
    maxWidth: 400,
  },
  large: {
    iconSize: 120,
    spacing: 4,
    titleVariant: 'h5' as const,
    descVariant: 'body1' as const,
    maxWidth: 500,
  },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-data',
  title,
  description,
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  imageUrl,
  size = 'medium',
  paper = false,
}) => {
  const config = type !== 'custom' ? typeConfig[type] : null;
  const sizeStyles = sizeConfig[size];

  const displayTitle = title || config?.title || 'Không có dữ liệu';
  const displayDescription =
    description || config?.description || 'Chưa có dữ liệu để hiển thị.';

  const IconComponent = config?.icon || Inbox;

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: sizeStyles.spacing,
        px: 3,
        maxWidth: sizeStyles.maxWidth,
        mx: 'auto',
      }}
    >
      {/* Icon or Image */}
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt={displayTitle}
          sx={{
            width: sizeStyles.iconSize * 1.5,
            height: sizeStyles.iconSize * 1.5,
            objectFit: 'contain',
            mb: 2,
          }}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: sizeStyles.iconSize,
            height: sizeStyles.iconSize,
            borderRadius: '50%',
            backgroundColor: config?.bgColor || 'grey.100',
            mb: 2,
          }}
        >
          {icon || (
            <IconComponent
              sx={{
                fontSize: sizeStyles.iconSize * 0.5,
                color: config?.iconColor || 'grey.400',
              }}
            />
          )}
        </Box>
      )}

      {/* Title */}
      <Typography
        variant={sizeStyles.titleVariant}
        fontWeight={600}
        color="text.primary"
        gutterBottom
      >
        {displayTitle}
      </Typography>

      {/* Description */}
      <Typography
        variant={sizeStyles.descVariant}
        color="text.secondary"
        sx={{ mb: onAction || onSecondaryAction ? 3 : 0 }}
      >
        {displayDescription}
      </Typography>

      {/* Actions */}
      {(onAction || onSecondaryAction) && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          {onAction && actionText && (
            <Button
              variant="contained"
              onClick={onAction}
              startIcon={<Add />}
              size={size === 'small' ? 'small' : 'medium'}
            >
              {actionText}
            </Button>
          )}
          {onSecondaryAction && secondaryActionText && (
            <Button
              variant="outlined"
              onClick={onSecondaryAction}
              size={size === 'small' ? 'small' : 'medium'}
            >
              {secondaryActionText}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );

  if (paper) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 3,
          py: 4,
        }}
      >
        {content}
      </Paper>
    );
  }

  return content;
};

export default EmptyState;
