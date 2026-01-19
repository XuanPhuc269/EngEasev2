'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, Stack, Divider } from '@mui/material';
import { CheckCircle, School, EmojiEvents, TrendingUp } from '@mui/icons-material';

interface ProgressTimeLineProps {
  recentActivity?: Array<{
    date: string;
    type: 'test_completed' | 'milestone' | 'improvement';
    title: string;
    description?: string;
  }>;
}

const ProgressTimeLine: React.FC<ProgressTimeLineProps> = ({ recentActivity = [] }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'test_completed':
        return <CheckCircle />;
      case 'milestone':
        return <EmojiEvents />;
      case 'improvement':
        return <TrendingUp />;
      default:
        return <School />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'test_completed':
        return 'primary.main';
      case 'milestone':
        return 'warning.main';
      case 'improvement':
        return 'success.main';
      default:
        return 'grey.500';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Recent Activity
        </Typography>

        {recentActivity.length > 0 ? (
          <Stack spacing={2}>
            {recentActivity.map((activity, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  {/* Icon with dot */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: getActivityColor(activity.type),
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {activity.title}
                    </Typography>
                    {activity.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {activity.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {new Date(activity.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                {index < recentActivity.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <School sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              No recent activity. Start taking tests to track your progress!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressTimeLine;
