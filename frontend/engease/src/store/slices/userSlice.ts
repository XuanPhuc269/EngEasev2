import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface UserState {
    profile: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<User>) => {
            state.profile = action.payload;
            state.isLoading = false;
            state.error = null;
        },

        updateProfile: (state, action: PayloadAction<Partial<User>>) => {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload };
            }
        },

        setUserLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        
        clearProfile: (state) => {
            state.profile = null
            state.isLoading = false;
            state.error = null;
        },

        
    }
})