'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { ReactNode, useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { initializeAuth, setUser, setLoading } from './slices/authSlice';
import { useLazyGetCurrentUserQuery } from './api/authApi';

interface StoreProvideProps {
    children: ReactNode;
}

function AuthInitializer({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const [getCurrentUser] = useLazyGetCurrentUserQuery();

    useEffect(() => {
        const initAuth = async () => {
            dispatch(initializeAuth());
        }

        const accessToken = Cookies.get('accessToken');

        if (accessToken) {
            try {
                const result = await getCurrentUser().unwrap();
                if (result.success) {
                    dispatch(setUser(result.data));
                }   
            } catch (error) {
                console.log('Failed to fetch current user: ', error);
                dispatch(setLoading(false));
            } 
            else {
            dispatch(setLoading(false));
        }
    }
    initAuth();
    }, [dispatch, getCurrentUser]);
    
    return <>{children}</>;
}

export function StoreProvider({ children }: StoreProviderProps) {
    return (
        <Provider store={store}>
            <AuthInitializer>{children}</AuthInitializer>
        </Provider>
    );
}
