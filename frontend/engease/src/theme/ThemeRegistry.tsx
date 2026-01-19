'use client';

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';
import theme from './index';

interface ThemeRegistryProps {
    children: ReactNode;
}

// Create Emotion cache with prepend to ensure MUI styles load first
function createEmotionCache() {
    const cache = createCache({ key: 'mui', prepend: true });
    // Enable compatibility mode to avoid warnings with certain integrations
    (cache as any).compat = true;
    return cache;
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
    const [{ cache, flush }] = React.useState(() => {
        const cache = createEmotionCache();
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        (cache as any).insert = (...args: any[]) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            // @ts-expect-error - preserve original signature
            return prevInsert(...args);
        };
        const flush = () => {
            const prev = inserted;
            inserted = [];
            return prev;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) return null;
        let styles = '';
        names.forEach((name) => {
            const style = cache.inserted[name];
            if (typeof style === 'string') styles += style;
        });
        return (
            <style
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{ __html: styles }}
            />
        );
    });

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}