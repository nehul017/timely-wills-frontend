'use client';

import Link from 'next/link';
import React from 'react';
import './globals.css';

import ArrowRightIcon from '@/assets/icons/arrow-right';
import ErrorIcon from '@/assets/icons/error-icon';
import Header from '@/components/Header';

function NotFoundPage() {
  return (
    <>
      <Header />
      <main className='success mx-auto flex max-w-[700px] flex-col items-center px-6 xl:px-0'>
        <ErrorIcon className='my-[84px]' />
        <h1 className='mb-9 text-center text-[30px] font-bold leading-[50px] lg:text-[35px]'>
          Whoops! Something Went Wrong
        </h1>
        <p className='mb-9 text-xl'>We’re Sorry</p>
        <p className='mb-[60px] text-center text-xl'>
          It looks like we’ve encountered an unexpected error. Our team has been
          notified and is working to fix this issue as quickly as possible.
        </p>

        <Link
          className='flex items-center text-xl font-bold lg:text-[25px]'
          href='/'
        >
          <ArrowRightIcon fill='black' className='mr-2 rotate-180' />
          Go back to dashboard
        </Link>
      </main>
    </>
  );
}

export default NotFoundPage;
