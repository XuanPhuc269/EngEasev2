import { body, param, query, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .toLowerCase(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Tên là bắt buộc')
        .isLength({ max: 50 })
        .withMessage('Tên không được quá 50 ký tự'),
];

export const loginValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .toLowerCase(),
    body('password')
        .notEmpty()
        .withMessage('Mật khẩu là bắt buộc'),
];

export const forgotPasswordValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Email không hợp lệ')
        .toLowerCase(),
];

export const resetPasswordValidation: ValidationChain[] = [
    body('password')
        .isLength({ min: 6 })
        .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),
    body('token')
        .notEmpty()
        .withMessage('Token là bắt buộc'),
];

export const updateProfileValidation: ValidationChain[] = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Tên không được quá 50 ký tự'),
    body('targetScore')
        .optional()
        .isFloat({ min: 0, max: 9 })
        .withMessage('Điểm mục tiêu phải từ 0 đến 9'),
];

export const createTestValidation: ValidationChain[] = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Tiêu đề là bắt buộc')
        .isLength({ max: 200 })
        .withMessage('Tiêu đề không được quá 200 ký tự'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Mô tả là bắt buộc')
        .isLength({ max: 1000 })
        .withMessage('Mô tả không được quá 1000 ký tự'),
    body('type')
        .isIn(['listening', 'reading', 'writing', 'speaking', 'full_test'])
        .withMessage('Loại test không hợp lệ'),
    body('difficulty')
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Độ khó không hợp lệ'),
    body('duration')
        .isInt({ min: 1 })
        .withMessage('Thời gian làm bài phải lớn hơn 0'),
    body('passScore')
        .isFloat({ min: 0, max: 9 })
        .withMessage('Điểm đạt phải từ 0 đến 9'),
];

export const submitTestValidation: ValidationChain[] = [
    body('answers')
        .isArray({ min: 1 })
        .withMessage('Câu trả lời phải là một mảng và không được rỗng'),
    body('answers.*.questionId')
        .notEmpty()
        .withMessage('Question ID là bắt buộc'),
    body('answers.*.userAnswer')
        .notEmpty()
        .withMessage('Câu trả lời là bắt buộc'),
    body('timeSpent')
        .isInt({ min: 0 })
        .withMessage('Thời gian làm bài phải lớn hơn hoặc bằng 0'),
];

export const idParamValidation: ValidationChain[] = [
    param('id')
        .isMongoId()
        .withMessage('ID không hợp lệ'),
];

export const paginationValidation: ValidationChain[] = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page phải là số nguyên dương'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit phải từ 1 đến 100'),
];
