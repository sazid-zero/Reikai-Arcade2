'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import LenisProvider from '@/components/lenis-provider';
import { CartProvider } from '@/components/cart-context';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LenisProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </LenisProvider>
  );
}
