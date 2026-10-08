'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import LenisProvider from '@/components/lenis-provider';
import { CartProvider } from '@/components/cart-context';
import { SearchProvider } from '@/components/search-modal';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LenisProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
            <Toaster />
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </LenisProvider>
  );
}
