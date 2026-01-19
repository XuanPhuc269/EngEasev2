export interface SkillProgress {
  skillType: string;
  averageScore: number;
  testsCompleted: number;
  lastTestDate?: string;
  improvement: number;
}

export interface Progress {
  _id: string;
  userId: string;
  overallBandScore: number;
  totalTestsCompleted: number;
  totalTimeSpent: number;
  skillsProgress: SkillProgress[];
  strengths: string[];
  weaknesses: string[];
  studyStreak: number;
  lastStudyDate?: string;
  targetScore?: number;
  progressToTarget?: number;
  recentActivity?: Array<{
    testTitle: string;
    score: number;
    isPassed: boolean;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressResponse {
  success: boolean;
  data: Progress;
}