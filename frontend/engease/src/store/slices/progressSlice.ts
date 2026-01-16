import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Progress, SkillProgress } from '@/types';

interface ProgressState {
    userProgress: Progress | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProgressState = {
    userProgress: null,
    loading: false,
    error: null,
};

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        setProgress(state, action: PayloadAction<Progress>) {
            state.userProgress = action.payload;
            state.loading = false;
            state.error = null;
        },
        
        updateSkillProgress(state, action: PayloadAction<SkillProgress>) {
            if (state.userProgress) {
                const skillIndex = state.userProgress.skillsProgress.findIndex(
                    (skill) => skill.skillType === action.payload.skillType
                );
                if (skillIndex !== -1) {
                    state.userProgress.skillsProgress[skillIndex] = action.payload;
                } else {
                    state.userProgress.skillsProgress.push(action.payload);
                }
            }
        },

        setProgressLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setProgressError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
            state.loading = false;
        },

        clearProgress(state) {
            state.userProgress = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const {
    setProgress,
    updateSkillProgress,
    setProgressLoading,
    setProgressError,
    clearProgress
} = progressSlice.actions;

export default progressSlice.reducer;