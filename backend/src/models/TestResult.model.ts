import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
    questionId: mongoose.Types.ObjectId;
    userAnswer: string | string[];
    isCorrect?: boolean;
    pointsEarned?: number;
}

export interface ITestResult extends Document {
    userId: mongoose.Types.ObjectId;
    testId: mongoose.Types.ObjectId;
    answers: IAnswer[];
    score: number; // Overall band score (0-9)
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    skippedAnswers: number;
    timeSpent: number; // in seconds
    isPassed: boolean;
    feedback?: string; // For writing and speaking
    teacherFeedback?: string;
    gradedBy?: mongoose.Types.ObjectId; // Teacher who graded (for writing/speaking)
    gradedAt?: Date;
    startedAt: Date;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const testResultSchema = new Schema<ITestResult>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        testId: {
            type: Schema.Types.ObjectId,
            ref: 'Test',
            required: true,
        },
        answers: [
            {
                questionId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Question',
                    required: true,
                },
                userAnswer: {
                    type: Schema.Types.Mixed,
                    required: true,
                },
                isCorrect: {
                    type: Boolean,
                    default: null,
                },
                pointsEarned: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 9,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
        correctAnswers: {
            type: Number,
            required: true,
            default: 0,
        },
        wrongAnswers: {
            type: Number,
            required: true,
            default: 0,
        },
        skippedAnswers: {
            type: Number,
            required: true,
            default: 0,
        },
        timeSpent: {
            type: Number,
            required: true,
            default: 0,
        },
        isPassed: {
            type: Boolean,
            required: true,
        },
        feedback: {
            type: String,
            default: null,
        },
        teacherFeedback: {
            type: String,
            default: null,
        },
        gradedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        gradedAt: {
            type: Date,
            default: null,
        },
        startedAt: {
            type: Date,
            required: true,
        },
        completedAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
testResultSchema.index({ userId: 1, testId: 1 });
testResultSchema.index({ userId: 1, createdAt: -1 });
testResultSchema.index({ score: 1 });

export default mongoose.model<ITestResult>('TestResult', testResultSchema);
