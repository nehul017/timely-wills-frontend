'use client';

import AboutSection from '@/components/about-you/AboutSection';
import Agreement from '@/components/about-you/Agreement';
import withAuth from '@/components/withAuth';
import { useProgressStepStore } from '@/store/progress-steps';
import { useSearchParams } from 'next/navigation';

function AboutPage() {
  const { aboutStep } = useProgressStepStore();
  const searchParams = useSearchParams();
  const isNew = searchParams.get('new') === '1';

  return (
    <section className='py-12'>
      <article className='relative mx-auto flex max-w-[1200px] flex-col gap-8 px-6 lg:flex-row lg:gap-[60px] xl:px-0'>
        {isNew ? (
          <Agreement />
        ) : (
          <>
            {aboutStep < 3 && <AboutSection />}
            {aboutStep === 3 && <Agreement />}
          </>
        )}
      </article>
    </section>
  );
}

export default withAuth(AboutPage);
