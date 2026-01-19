'use client';

import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { Progress, SkillProgress } from '@/types/progress.types';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';

interface SkillChartProps {
  progress: Progress;
}

const SkillChart: React.FC<SkillChartProps> = ({ progress }) => {
  // Safeguard against undefined skillsProgress
  const skillsProgress = Array.isArray(progress?.skillsProgress) ? progress.skillsProgress : [];

  const getSkillColor = (score: number) => {
    if (score >= 7) return 'success.main';
    if (score >= 5.5) return 'info.main';
    if (score >= 4) return 'warning.main';
    return 'error.main';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp color="success" fontSize="small" />;
    if (improvement < 0) return <TrendingDown color="error" fontSize="small" />;
    return <Remove color="action" fontSize="small" />;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return 'success.main';
    if (improvement < 0) return 'error.main';
    return 'text.secondary';
  };

  const getSkillDisplayName = (skillType: string) => {
    const skillNames: Record<string, string> = {
      listening: 'Listening',
      reading: 'Reading',
      writing: 'Writing',
      speaking: 'Speaking',
      vocabulary: 'Vocabulary',
      grammar: 'Grammar',
    };
    return skillNames[skillType] || skillType;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Skills Progress
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {skillsProgress.map((skill, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {getSkillDisplayName(skill.skillType)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={700} color={getSkillColor(skill.averageScore)}>
                    {skill.averageScore.toFixed(1)}
                  </Typography>
                  {skill.improvement !== 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getImprovementIcon(skill.improvement)}
                      <Typography variant="caption" color={getImprovementColor(skill.improvement)}>
                        {Math.abs(skill.improvement).toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              
              <Box sx={{ position: 'relative', height: 8, bgcolor: 'action.hover', borderRadius: 1, overflow: 'hidden' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${(skill.averageScore / 9) * 100}%`,
                    bgcolor: getSkillColor(skill.averageScore),
                    borderRadius: 1,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {skill.testsCompleted} test{skill.testsCompleted !== 1 ? 's' : ''}
                </Typography>
                {skill.lastTestDate && (
                  <Typography variant="caption" color="text.secondary">
                    Last: {new Date(skill.lastTestDate).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        {skillsProgress.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
            No skill data available yet. Complete tests to see your progress!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillChart;
