/* eslint-disable jsx-a11y/iframe-has-title */
import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import AuthWrapper from '@/components/AuthWrapper';
import { cn } from '@/lib/utils';
import { LayoutProps } from '@/types';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Timely Wills',
  description: 'The Online Will platform for Americans',
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang='en'>
      <GoogleTagManager gtmId='GTM-KKSPPGBL' />
      <body
        className={cn(
          poppins.className,
          'flex min-h-screen flex-col',
        )}
      >
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-KKSPPGBL'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
