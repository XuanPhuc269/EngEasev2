import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string,
    type: NotificationType,
    message: string,
    duration?: number, 
}

interface UiState {
    notifications: Notification[];
    isLoading: boolean;
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
}

const initialState: UiState = {
    notifications: [],
    isLoading: false,
    sidebarOpen: true,
    theme: 'light',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
            const id = Date.now().toString();
            state.notifications.push({ id, ...action.payload });
        },

        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (notification) => notification.id !== action.payload
            );
        },

        clearNotifications: (state) => {
            state.notifications = [];
        },
        
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },

        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },

        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        },

        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
});

export const {
    addNotification,
    removeNotification,
    clearNotifications,
    setLoading,
    toggleSidebar,
    setSidebarOpen,
    setTheme,
    toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
