import type { Metadata } from 'next';
import ThemeProvider from '@/theme/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { AssignmentProvider } from '@/context/AssignmentContext';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#0A0E1A',
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            <AssignmentProvider>{children}</AssignmentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
