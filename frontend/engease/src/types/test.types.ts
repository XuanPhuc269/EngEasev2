export enum TestType {
  LISTENING = 'listening',
  READING = 'reading',
  WRITING = 'writing',
  SPEAKING = 'speaking',
  FULL_TEST = 'full_test',
}

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export interface Test {
  _id: string;
  title: string;
  description: string;
  type: TestType;
  difficulty?: Difficulty;
  duration: number;
  totalQuestions: number;
  passScore: number;
  isPublished: boolean;
  createdBy: {
    _id: string;
    name: string;
    email?: string;
  };
  questions: string[];
  tags: string[];
  audioUrl?: string;
  readingPassage?: string;
  writingPrompt?: string;
  speakingTopics?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestRequest {
  title: string;
  description: string;
  type: TestType;
  difficulty: Difficulty;
  duration: number;
  totalQuestions: number;
  passScore: number;
  tags?: string[];
  audioUrl?: string;
  readingPassage?: string;
  writingPrompt?: string;
  speakingTopics?: string[];
}

export interface UpdateTestRequest extends Partial<CreateTestRequest> {
  isPublished?: boolean;
}

export interface TestsResponse {
  success: boolean;
  message?: string;
  data: Test[];
  pagination: PaginationInfo;
}

export interface TestResponse {
  success: boolean;
  data: Test;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TestFilters {
  type?: TestType;
  difficulty?: Difficulty;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}