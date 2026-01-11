import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillProgress {
    skillType: string; // listening, reading, writing, speaking
    averageScore: number;
    testsCompleted: number;
    lastTestDate?: Date;
    improvement: number; // Percentage improvement
}

export interface IProgress extends Document {
    userId: mongoose.Types.ObjectId;
    overallBandScore: number;
    totalTestsCompleted: number;
    totalTimeSpent: number; // in minutes
    skillsProgress: ISkillProgress[];
    strengths: string[]; // Areas where student is strong
    weaknesses: string[]; // Areas needing improvement
    studyStreak: number; // Consecutive days of study
    lastStudyDate?: Date;
    targetScore?: number;
    progressToTarget?: number; // Percentage
    createdAt: Date;
    updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        overallBandScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 9,
        },
        totalTestsCompleted: {
            type: Number,
            default: 0,
        },
        totalTimeSpent: {
            type: Number,
            default: 0,
        },
        skillsProgress: [
            {
                skillType: {
                    type: String,
                    required: true,
                },
                averageScore: {
                    type: Number,
                    default: 0,
                    min: 0,
                    max: 9,
                },
                testsCompleted: {
                    type: Number,
                    default: 0,
                },
                lastTestDate: {
                    type: Date,
                    default: null,
                },
                improvement: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        strengths: [
            {
                type: String,
            },
        ],
        weaknesses: [
            {
                type: String,
            },
        ],
        studyStreak: {
            type: Number,
            default: 0,
        },
        lastStudyDate: {
            type: Date,
            default: null,
        },
        targetScore: {
            type: Number,
            min: 0,
            max: 9,
            default: null,
        },
        progressToTarget: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
progressSchema.index({ userId: 1 });

export default mongoose.model<IProgress>('Progress', progressSchema);
