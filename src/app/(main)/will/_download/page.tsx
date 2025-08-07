'use client';

import React from 'react';

import Footer from '@/components/Footer';
import WillDownload from '@/components/will/WillDownload';
import WillStepper from '@/components/WillStepper';
import withAuth from '@/components/withAuth';
import { willSteps } from '@/constant/will';

function DownloadWillPage() {
  return (
    <>
      <section className='py-12'>
        <article className='mx-auto flex max-w-[1200px] flex-col gap-8 px-6 lg:flex-row lg:gap-[60px] xl:px-0'>
          <WillStepper steps={willSteps} />
          <WillDownload />
        </article>
      </section>

      <div className='container max-w-[1200px] px-6 xl:p-0'>
        <Footer />
      </div>
    </>
  );
}

export default withAuth(DownloadWillPage);
