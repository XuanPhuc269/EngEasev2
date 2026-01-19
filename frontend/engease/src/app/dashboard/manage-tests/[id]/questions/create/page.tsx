'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
  Radio,
  RadioGroup,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Add,
  Delete,
  ArrowBack,
  Save,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetTestByIdQuery } from '@/store/api/testApi';
import { useCreateQuestionMutation, useGetQuestionsByTestIdQuery } from '@/store/api/questionApi';
import { QuestionType } from '@/types';

const optionSchema = z.object({
  text: z.string().min(1, 'Đáp án không được để trống'),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  questionNumber: z.number().min(1),
  type: z.nativeEnum(QuestionType),
  question: z.string().min(1, 'Câu hỏi không được để trống'),
  passage: z.string().optional(),
  options: z.array(optionSchema).optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string().optional(),
  points: z.number().min(0.5, 'Điểm tối thiểu là 0.5').max(10),
  section: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  audioUrl: z.string().url().optional().or(z.literal('')),
});

type QuestionFormData = z.infer<typeof questionSchema>;

const CreateQuestionPage = () => {
  const params = useParams();
  const router = useRouter();
  const testId = params?.id as string;

  const { data: testData } = useGetTestByIdQuery(testId);
  const { data: questionsData } = useGetQuestionsByTestIdQuery(testId);
  const [createQuestion, { isLoading }] = useCreateQuestionMutation();
  const [error, setError] = useState<string | null>(null);

  const existingQuestions = questionsData?.data || [];
  const nextQuestionNumber = existingQuestions.length + 1;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionNumber: nextQuestionNumber,
      type: QuestionType.MULTIPLE_CHOICE,
      question: '',
      passage: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
      correctAnswer: '',
      explanation: '',
      points: 1,
      section: '',
      imageUrl: '',
      audioUrl: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const questionType = watch('type');

  const onSubmit = async (data: QuestionFormData) => {
    try {
      setError(null);
      
      // Prepare submission data based on question type
      const submissionData: any = {
        testId,
        questionNumber: nextQuestionNumber, // Always use auto-calculated number
        type: data.type,
        question: data.question,
        points: data.points,
        section: data.section || undefined,
        imageUrl: data.imageUrl || undefined,
        audioUrl: data.audioUrl || undefined,
        explanation: data.explanation || undefined,
      };

      // Always include passage if provided
      if (data.passage && data.passage.trim()) {
        submissionData.passage = data.passage.trim();
      }

      // Add type-specific fields
      if (data.type === QuestionType.MULTIPLE_CHOICE) {
        const hasCorrect = data.options?.some(opt => opt.isCorrect);
        if (!hasCorrect) {
          setError('Phải chọn ít nhất một đáp án đúng');
          return;
        }
        submissionData.options = data.options;
      } else if (data.type === QuestionType.ESSAY || data.type === QuestionType.SPEAKING) {
        // Essay and Speaking don't need correctAnswer
        submissionData.correctAnswer = undefined;
      } else {
        // Other types use correctAnswer
        submissionData.correctAnswer = data.correctAnswer || '';
      }

      console.log('Submitting question with passage:', submissionData);

      await createQuestion(submissionData).unwrap();

      router.push(`/dashboard/manage-tests/${testId}/questions`);
    } catch (err: any) {
      console.error('Failed to create question:', err);
      setError(err.data?.message || 'Không thể tạo câu hỏi. Vui lòng thử lại.');
    }
  };

  const test = testData?.data;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={() => router.back()}
            startIcon={<ArrowBack />}
            variant="outlined"
          >
            Quay lại
          </Button>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Thêm câu hỏi mới
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {test?.title}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Thông tin câu hỏi
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Số thứ tự"
                      type="number"
                      fullWidth
                      value={nextQuestionNumber}
                      disabled
                      helperText="Số thứ tự được tự động tăng"
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth required>
                          <InputLabel>Loại câu hỏi</InputLabel>
                          <Select {...field} label="Loại câu hỏi">
                            <MenuItem value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</MenuItem>
                            <MenuItem value={QuestionType.TRUE_FALSE_NOT_GIVEN}>True/False/Not Given</MenuItem>
                            <MenuItem value={QuestionType.FILL_IN_BLANK}>Fill in the Blank</MenuItem>
                            <MenuItem value={QuestionType.SHORT_ANSWER}>Short Answer</MenuItem>
                            <MenuItem value={QuestionType.ESSAY}>Essay</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="points"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Điểm"
                          type="number"
                          fullWidth
                          required
                          inputProps={{ min: 0.5, max: 10, step: 0.5 }}
                          error={!!errors.points}
                          helperText={errors.points?.message}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="question"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Câu hỏi"
                          fullWidth
                          required
                          multiline
                          rows={3}
                          error={!!errors.question}
                          helperText={errors.question?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="section"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Phần (Section)"
                          fullWidth
                          placeholder="Ví dụ: Part 1, Reading Passage 1"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Options for Multiple Choice */}
            {questionType === QuestionType.MULTIPLE_CHOICE && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Đáp án
                    </Typography>
                    <Button
                      startIcon={<Add />}
                      onClick={() => append({ text: '', isCorrect: false })}
                      variant="outlined"
                      size="small"
                    >
                      Thêm đáp án
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={2}>
                    {fields.map((field, index) => (
                      <Box key={field.id} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Controller
                          name={`options.${index}.text`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={`Đáp án ${index + 1}`}
                              fullWidth
                              error={!!errors.options?.[index]?.text}
                              helperText={errors.options?.[index]?.text?.message}
                            />
                          )}
                        />
                        <Controller
                          name={`options.${index}.isCorrect`}
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value}
                                  onChange={field.onChange}
                                />
                              }
                              label="Đúng"
                              sx={{ minWidth: 80 }}
                            />
                          )}
                        />
                        {fields.length > 2 && (
                          <IconButton
                            onClick={() => remove(index)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Correct Answer for True/False/Not Given */}
            {questionType === QuestionType.TRUE_FALSE_NOT_GIVEN && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Đáp án đúng
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Controller
                    name="correctAnswer"
                    control={control}
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup {...field}>
                          <FormControlLabel value="True" control={<Radio />} label="True" />
                          <FormControlLabel value="False" control={<Radio />} label="False" />
                          <FormControlLabel value="Not Given" control={<Radio />} label="Not Given" />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </Paper>
              </Grid>
            )}

            {/* Correct Answer for other types */}
            {questionType !== QuestionType.MULTIPLE_CHOICE && 
             questionType !== QuestionType.ESSAY && 
             questionType !== QuestionType.TRUE_FALSE_NOT_GIVEN && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Đáp án đúng
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Controller
                    name="correctAnswer"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Đáp án"
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Nhập đáp án đúng"
                      />
                    )}
                  />
                </Paper>
              </Grid>
            )}

            {/* Explanation */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Giải thích
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Controller
                  name="explanation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Giải thích đáp án"
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Giải thích tại sao đây là đáp án đúng..."
                    />
                  )}
                />
              </Paper>
            </Grid>

            {/* Media */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Media
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="imageUrl"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="URL Hình ảnh"
                          fullWidth
                          placeholder="https://example.com/image.jpg"
                          error={!!errors.imageUrl}
                          helperText={errors.imageUrl?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
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
                          helperText={errors.audioUrl?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => router.back()}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang lưu...' : 'Lưu câu hỏi'}
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateQuestionPage;
