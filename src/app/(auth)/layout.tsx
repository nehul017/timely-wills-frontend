'use client';

import Link from 'next/link';

import '../globals.css';
import LogoIcon from '@/assets/icons/logo';
import { LayoutProps } from '@/types';

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='flex justify-center bg-[#c8f4e452] py-8'>
        <Link href='/'>
          <LogoIcon className='h-[54px] w-[198px]' />
        </Link>
      </header>
      <main>{children}</main>
    </div>
  );
}
