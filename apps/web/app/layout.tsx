import type { Metadata } from 'next';
import './globals.css';
import LayoutShell from '@/components/LayoutShell';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'MatrixLabel: Verified Computer Vision Annotation & Dataset QA',
  description:
    'Managed image dataset labeling with automated ground-truth verification and multi-format exports for COCO, YOLO, and Pascal VOC.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('matrixlabel-theme');
                  if (stored === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-150">
        <ThemeProvider>
          <LayoutShell>{children}</LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
