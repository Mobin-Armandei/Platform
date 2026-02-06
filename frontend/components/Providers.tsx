'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/react-query';
import ThemeRegistry from './ThemeRegistry';
import { ReactNode } from 'react';
import { AuthProvider } from "@/context/authContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
      <ThemeRegistry>{children}</ThemeRegistry>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </AuthProvider>
  );
}