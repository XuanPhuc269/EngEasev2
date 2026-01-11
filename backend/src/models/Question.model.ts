import mongoose, { Document, Schema } from 'mongoose';

export enum QuestionType {
    MULTIPLE_CHOICE = 'multiple_choice',
    TRUE_FALSE_NOT_GIVEN = 'true_false_not_given',
    MATCHING = 'matching',
    FILL_IN_BLANK = 'fill_in_blank',
    SHORT_ANSWER = 'short_answer',
    ESSAY = 'essay',
    SPEAKING = 'speaking',
}

export interface IOption {
    text: string;
    isCorrect: boolean;
}

export interface IQuestion extends Document {
    testId: mongoose.Types.ObjectId;
    questionNumber: number;
    type: QuestionType;
    question: string;
    options?: IOption[]; // For multiple choice
    correctAnswer?: string | string[]; // For fill in blank, short answer, matching
    explanation?: string;
    points: number;
    section?: string; // Part 1, Part 2, etc.
    imageUrl?: string;
    audioUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
    {
        testId: {
            type: Schema.Types.ObjectId,
            ref: 'Test',
            required: true,
        },
        questionNumber: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(QuestionType),
            required: [true, 'Loại câu hỏi là bắt buộc'],
        },
        question: {
            type: String,
            required: [true, 'Nội dung câu hỏi là bắt buộc'],
        },
        options: [
            {
                text: {
                    type: String,
                    required: true,
                },
                isCorrect: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        correctAnswer: {
            type: Schema.Types.Mixed, // Can be string or array of strings
            default: null,
        },
        explanation: {
            type: String,
            default: null,
        },
        points: {
            type: Number,
            required: true,
            default: 1,
            min: 0,
        },
        section: {
            type: String,
            default: null,
        },
        imageUrl: {
            type: String,
            default: null,
        },
        audioUrl: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
questionSchema.index({ testId: 1, questionNumber: 1 });

export default mongoose.model<IQuestion>('Question', questionSchema);
