import { RootState } from '../index';

export const selectCurrentTest = (state: RootState) => state.test.currentTest;
export const selectQuestions = (state: RootState) => state.test.questions;
export const selectAnswers = (state: RootState) => state.test.answers;
export const selectCurrentQuestionIndex = (state: RootState) => state.test.currentQuestionIndex;
export const selectTimeRemaining = (state: RootState) => state.test.timeRemaining;
export const selectIsTestCompleted = (state: RootState) => state.test.isCompleted;
export const selectIsSubmitting = (state: RootState) => state.test.isSubmitting;
export const selectStartedAt = (state: RootState) => state.test.startedAt;

export const selectCurrentQuestion = (state: RootState) => {
    const { questions, currentQuestionIndex } = state.test;
    return questions[currentQuestionIndex] || null;
};

export const selectCurrentAnswer = (state: RootState) => {
    const { answers, currentQuestionIndex, questions } = state.test;
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;
    return answers.find((a) => a.questionId === currentQuestion._id) || null;
};

export const selectAnsweredQuestionsCount = (state: RootState) => {
    return state.test.answers.filter(
        (a) => a.userAnswer !== '' && a.userAnswer.length > 0
    ).length;
};

export const selectTestProgress = (state: RootState) => {
    const { answers, questions } = state.test;
    if (questions.length === 0) return 0;
    const answered = answers.filter(
        (a) => a.userAnswer !== '' && a.userAnswer.length > 0
    ).length;
    return Math.round((answered / questions.length) * 100);
};