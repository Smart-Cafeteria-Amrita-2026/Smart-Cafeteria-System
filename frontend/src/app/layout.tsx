import '../styles/globals.css';

import type { ReactNode } from 'react';
import { ReactQueryProvider } from '@/lib/react-query-provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
