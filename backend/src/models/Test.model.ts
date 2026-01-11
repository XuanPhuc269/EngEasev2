import mongoose, { Document, Schema } from 'mongoose';

export enum TestType {
    LISTENING = 'listening',
    READING = 'reading',
    WRITING = 'writing',
    SPEAKING = 'speaking',
    FULL_TEST = 'full_test',
}

export interface ITest extends Document {
    title: string;
    description: string;
    type: TestType;
    duration: number; // in minutes
    totalQuestions: number;
    passScore: number;
    isPublished: boolean;
    createdBy: mongoose.Types.ObjectId;
    questions: mongoose.Types.ObjectId[];
    tags: string[];
    audioUrl?: string; 
    readingPassage?: string; 
    writingPrompt?: string; 
    speakingTopics?: string[]; 
    createdAt: Date;
    updatedAt: Date;
}

const testSchema = new Schema<ITest>(
    {
        title: {
            type: String,
            required: [true, 'Tiêu đề bài test là bắt buộc'],
            trim: true,
            maxlength: [200, 'Tiêu đề không được quá 200 ký tự'],
        },
        description: {
            type: String,
            required: [true, 'Mô tả bài test là bắt buộc'],
            maxlength: [1000, 'Mô tả không được quá 1000 ký tự'],
        },
        type: {
            type: String,
            enum: Object.values(TestType),
            required: [true, 'Loại bài test là bắt buộc'],
        },
        duration: {
            type: Number,
            required: [true, 'Thời gian làm bài là bắt buộc'],
            min: [1, 'Thời gian làm bài phải lớn hơn 0'],
        },
        totalQuestions: {
            type: Number,
            required: true,
            min: [1, 'Số câu hỏi phải lớn hơn 0'],
        },
        passScore: {
            type: Number,
            required: true,
            min: 0,
            max: 9,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        questions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Question',
            },
        ],
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        audioUrl: {
            type: String,
            default: null,
        },
        readingPassage: {
            type: String,
            default: null,
        },
        writingPrompt: {
            type: String,
            default: null,
        },
        speakingTopics: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for better search performance
testSchema.index({ type: 1, difficulty: 1, isPublished: 1 });
testSchema.index({ tags: 1 });
testSchema.index({ createdBy: 1 });

export default mongoose.model<ITest>('Test', testSchema);
