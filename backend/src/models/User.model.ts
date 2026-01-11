import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
    STUDENT = 'student',
    TEACHER = 'teacher',
    ADMIN = 'admin',
}

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    avatar?: string;
    targetScore?: number;
    currentLevel?: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    refreshToken?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateResetPasswordToken(): string;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email là bắt buộc'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
        },
        password: {
            type: String,
            required: [true, 'Mật khẩu là bắt buộc'],
            minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
            select: false,
        },
        name: {
            type: String,
            required: [true, 'Tên là bắt buộc'],
            trim: true,
            maxlength: [50, 'Tên không được quá 50 ký tự'],
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STUDENT,
        },
        avatar: {
            type: String,
            default: null,
        },
        targetScore: {
            type: Number,
            min: 0,
            max: 9,
            default: null,
        },
        currentLevel: {
            type: String,
            default: null,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
            select: false,
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpire: {
            type: Date,
            select: false,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate reset password token
userSchema.methods.generateResetPasswordToken = function (): string {
    const resetToken = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    this.resetPasswordToken = bcrypt.hashSync(resetToken, 10);
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    return resetToken;
};

export default mongoose.model<IUser>('User', userSchema);
