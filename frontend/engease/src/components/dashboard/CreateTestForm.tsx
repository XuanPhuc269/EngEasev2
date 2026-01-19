'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Divider,
  IconButton,
  Paper,
  Alert,
} from '@mui/material';
import {
  Add,
  Delete,
  CloudUpload,
  Save,
  Preview,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TestType, Difficulty, CreateTestRequest } from '@/types';

// Validation schema
const createTestSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề quá dài'),
  description: z.string().min(1, 'Mô tả là bắt buộc').max(1000, 'Mô tả quá dài'),
  type: z.enum(['listening', 'reading', 'writing', 'speaking', 'full_test']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().min(1, 'Thời gian phải lớn hơn 0').max(300, 'Thời gian tối đa 300 phút'),
  totalQuestions: z.number().min(1, 'Số câu hỏi phải lớn hơn 0').max(100, 'Số câu hỏi tối đa 100'),
  passScore: z.number().min(0, 'Điểm đạt phải từ 0').max(9, 'Điểm đạt tối đa 9'),
  tags: z.array(z.string()).optional(),
  audioUrl: z.string().url().optional().or(z.literal('')),
  readingPassage: z.string().optional(),
  writingPrompt: z.string().optional(),
  speakingTopics: z.array(z.string()).optional(),
});

type CreateTestFormData = z.infer<typeof createTestSchema>;

interface CreateTestFormProps {
  onSubmit?: (data: CreateTestRequest) => void;
  initialData?: Partial<CreateTestRequest>;
  loading?: boolean;
}

const CreateTestForm: React.FC<CreateTestFormProps> = ({
  onSubmit,
  initialData,
  loading,
}) => {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateTestFormData>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'listening',
      difficulty: initialData?.difficulty || 'intermediate',
      duration: initialData?.duration || 60,
      totalQuestions: initialData?.totalQuestions || 10,
      passScore: initialData?.passScore || 5.5,
      tags: initialData?.tags || [],
      audioUrl: initialData?.audioUrl || '',
      readingPassage: initialData?.readingPassage || '',
      writingPrompt: initialData?.writingPrompt || '',
      speakingTopics: initialData?.speakingTopics || [],
    },
  });

  const testType = watch('type');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleFormSubmit = (data: CreateTestFormData) => {
    if (onSubmit) {
      onSubmit({ 
        ...data, 
        tags,
        type: data.type as TestType,
        difficulty: data.difficulty as Difficulty,
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Thông tin cơ bản
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tiêu đề bài test"
                        fullWidth
                        required
                        error={!!errors.title}
                        helperText={errors.title?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mô tả"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth required error={!!errors.type}>
                        <InputLabel>Loại bài test</InputLabel>
                        <Select {...field} label="Loại bài test">
                          <MenuItem value="listening">Listening</MenuItem>
                          <MenuItem value="reading">Reading</MenuItem>
                          <MenuItem value="writing">Writing</MenuItem>
                          <MenuItem value="speaking">Speaking</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="difficulty"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth required error={!!errors.difficulty}>
                        <InputLabel>Độ khó</InputLabel>
                        <Select {...field} label="Độ khó">
                          <MenuItem value="beginner">Beginner</MenuItem>
                          <MenuItem value="intermediate">Intermediate</MenuItem>
                          <MenuItem value="advanced">Advanced</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Thời gian (phút)"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.duration}
                        helperText={errors.duration?.message}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="totalQuestions"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tổng số câu hỏi"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.totalQuestions}
                        helperText={errors.totalQuestions?.message}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="passScore"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Điểm đạt (0-9)"
                        type="number"
                        fullWidth
                        required
                        inputProps={{ min: 0, max: 9, step: 0.5 }}
                        error={!!errors.passScore}
                        helperText={errors.passScore?.message}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Media Upload */}
        {(testType === 'listening' || testType === 'reading' || testType === 'writing' || testType === 'speaking') && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Nội dung bài test
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={2}>
                  {testType === 'listening' && (
                    <Controller
                      name="audioUrl"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="URL Audio"
                          fullWidth
                          placeholder="https://example.com/audio.mp3"
                          error={!!errors.audioUrl}
                          helperText={errors.audioUrl?.message || 'Nhập URL của file audio'}
                        />
                      )}
                    />
                  )}

                  {testType === 'reading' && (
                    <Controller
                      name="readingPassage"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Đoạn văn đọc"
                          fullWidth
                          multiline
                          rows={8}
                          placeholder="Nhập đoạn văn cho bài reading..."
                          error={!!errors.readingPassage}
                          helperText={errors.readingPassage?.message}
                        />
                      )}
                    />
                  )}

                  {testType === 'writing' && (
                    <Controller
                      name="writingPrompt"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Đề bài writing"
                          fullWidth
                          multiline
                          rows={6}
                          placeholder="Nhập đề bài writing..."
                          error={!!errors.writingPrompt}
                          helperText={errors.writingPrompt?.message}
                        />
                      )}
                    />
                  )}

                  {testType === 'speaking' && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Chủ đề speaking (mỗi dòng một chủ đề)
                      </Typography>
                      <Controller
                        name="speakingTopics"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            fullWidth
                            multiline
                            rows={6}
                            placeholder="Nhập các chủ đề speaking (mỗi dòng một chủ đề)"
                            value={value?.join('\n') || ''}
                            onChange={(e) => {
                              const topics = e.target.value
                                .split('\n')
                                .filter(t => t.trim());
                              onChange(topics);
                            }}
                          />
                        )}
                      />
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Tags */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Tags
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Thêm tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddTag}
                >
                  Thêm
                </Button>
              </Stack>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="flex-end"
            >
              <Button variant="outlined" startIcon={<Preview />}>
                Xem trước
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu bài test'}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateTestForm;
