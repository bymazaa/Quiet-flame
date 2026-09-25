import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

// Display serif for headings — distinctive ball terminals, not the generic
// Playfair/cream-and-terracotta default. Loaded with a couple of weights only.
const fraunces = Fraunces({
    subsets: ['latin'],
    variable: '--font-fraunces',
    weight: ['500', '600'],
    style: ['normal', 'italic'],
    display: 'swap',
});

// Clean, highly legible sans for body copy and the admin dashboard.
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    weight: ['400', '500', '600'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'Quiet Flame Co. | Hand-Poured Soy Candles',
        template: '%s | Quiet Flame Co.',
    },
    description: 'Hand-poured soy candles made in small batches.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
            <body className="font-sans antialiased">
                {children}
                <Toaster
                    position="top-right"
                    duration={3000}
                    toastOptions={{
                        style: {
                            background: 'var(--color-surface)',
                            color: 'var(--color-chocolate)',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 2px 8px -2px rgb(0 0 0 / 0.08)',
                            fontSize: '13px',
                            padding: '10px 14px',
                            width: '280px',
                        },
                        classNames: {
                            success: 'border-l-2 !border-l-status-delivered',
                            error: 'border-l-2 !border-l-status-cancelled',
                        },
                    }}
                />
            </body>
        </html>
    );
}
