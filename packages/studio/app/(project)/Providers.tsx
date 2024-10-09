'use client';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { DemoThemeData } from '@/config/utils/Theme';
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const theme = createTheme(DemoThemeData);

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <RecoilRoot>
            <ThemeProvider theme={theme}>
                <SessionProvider>
                    <CssBaseline />
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </SessionProvider>
            </ThemeProvider>
        </RecoilRoot>
    );
}
