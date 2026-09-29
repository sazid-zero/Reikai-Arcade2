import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[hsl(var(--background))] p-4">
      <Card className="w-full max-w-md bg-[hsl(var(--card))] border-[hsl(var(--border))]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-[hsl(var(--primary))]" />
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
              404 Page Not Found
            </h1>
          </div>
          <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">
            The page you are looking for does not exist.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="button-primary inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Return Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
