import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeProvider from '@/theme/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { AssignmentProvider } from '@/context/AssignmentContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StudyTracker — Assignment & Deadline Manager',
  description:
    'An academic dashboard that helps students track assignments, manage deadlines, visualize workload, and prevent deadline stress.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, minHeight: '100vh' }}>
        <ThemeProvider>
          <AuthProvider>
            <AssignmentProvider>{children}</AssignmentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
