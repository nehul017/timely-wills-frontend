import React from 'react';

import Header from '@/components/Header';
import { LayoutProps } from '@/types';

import '../globals.css';

export default function MainLayout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <div className='bg-[#c8f4e4]'>{children}</div>
    </>
  );
}
