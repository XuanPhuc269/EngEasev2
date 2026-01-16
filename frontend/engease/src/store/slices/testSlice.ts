import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Test, Question } from '@/types';

interface UserAnswer {
  questionId: string;
  userAnswer: string | string[];
}

interface TestTakingState {
  currentTest: Test | null;
  questions: Question[];
  answers: UserAnswer[];
  currentQuestionIndex: number;
  startedAt: string | null;
  timeRemaining: number; // in seconds
  isSubmitting: boolean;
  isCompleted: boolean;
}

const initialState: TestTakingState = {
  currentTest: null,
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
  startedAt: null,
  timeRemaining: 0,
  isSubmitting: false,
  isCompleted: false,
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    startTest: (
      state,
      action: PayloadAction<{ test: Test; questions: Question[] }>
    ) => {
      state.currentTest = action.payload.test;
      state.questions = action.payload.questions;
      state.answers = action.payload.questions.map((q) => ({
        questionId: q._id,
        userAnswer: '',
      }));
      state.currentQuestionIndex = 0;
      state.startedAt = new Date().toISOString();
      state.timeRemaining = action.payload.test.duration * 60; // Convert minutes to seconds
      state.isSubmitting = false;
      state.isCompleted = false;
    },

    setAnswer: (
      state,
      action: PayloadAction<{ questionId: string; answer: string | string[] }>
    ) => {
      const index = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );
      if (index !== -1) {
        state.answers[index].userAnswer = action.payload.answer;
      }
    },

    goToQuestion: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.questions.length) {
        state.currentQuestionIndex = action.payload;
      }
    },

    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },

    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },

    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },

    decrementTime: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },

    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },

    completeTest: (state) => {
      state.isCompleted = true;
      state.isSubmitting = false;
    },

    resetTest: (state) => {
      state.currentTest = null;
      state.questions = [];
      state.answers = [];
      state.currentQuestionIndex = 0;
      state.startedAt = null;
      state.timeRemaining = 0;
      state.isSubmitting = false;
      state.isCompleted = false;
    },
  },
});

export const {
  startTest,
  setAnswer,
  goToQuestion,
  nextQuestion,
  previousQuestion,
  updateTimeRemaining,
  decrementTime,
  setSubmitting,
  completeTest,
  resetTest,
} = testSlice.actions;

export default testSlice.reducer;