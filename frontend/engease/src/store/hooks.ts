import { TypeUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch: () => useDispatch<AppDispatch>();
export const useAppSelector: TypeUseSelectorHook<RootState> = useSelector;