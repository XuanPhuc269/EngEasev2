export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE_NOT_GIVEN = 'true_false_not_given',
  MATCHING = 'matching',
  FILL_IN_BLANK = 'fill_in_blank',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  SPEAKING = 'speaking',
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  testId: string;
  questionNumber: number;
  type: QuestionType;
  question: string;
  options?: Option[];
  correctAnswer?: string | string[];
  explanation?: string;
  points: number;
  section?: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionRequest {
  testId: string;
  questionNumber: number;
  type: QuestionType;
  question: string;
  options?: Option[];
  correctAnswer?: string | string[];
  explanation?: string;
  points: number;
  section?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface BulkCreateQuestionsRequest {
  testId: string;
  questions: Omit<CreateQuestionRequest, 'testId'>[];
}

export interface QuestionsResponse {
  success: boolean;
  data: Question[];
}

export interface QuestionResponse {
  success: boolean;
  data: Question;
}