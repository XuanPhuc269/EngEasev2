import { TestType } from './test.types';

export interface Answer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect?: boolean | null;
  pointsEarned?: number;
}

export interface TestResult {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  testId: {
    _id: string;
    title: string;
    type: TestType;
    difficulty?: string;
  };
  answers: Answer[];
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  timeSpent: number;
  isPassed: boolean;
  feedback?: string;
  teacherFeedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  startedAt: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitTestRequest {
  testId: string;
  answers: {
    questionId: string;
    userAnswer: string | string[];
  }[];
  timeSpent: number;
  startedAt: string;
}

export interface GradeTestRequest {
  score: number;
  teacherFeedback: string;
}

export interface ResultsResponse {
  success: boolean;
  data: TestResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ResultResponse {
  success: boolean;
  data: TestResult;
}