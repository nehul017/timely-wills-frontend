'use client';

import Footer from '@/components/Footer';
import EstateSection from '@/components/will/estate/EstateSection';
import ExecutorsSection from '@/components/will/executors/ExecutorsSection';
import FamilySection from '@/components/will/family-and-guardians/FamilySection';
import GiftsSection from '@/components/will/gifts/GiftsSection';
import ReviewSection from '@/components/will/review/ReviewSection';
import WillDownload from '@/components/will/WillDownload';
import WillStepper from '@/components/WillStepper';
import withAuth from '@/components/withAuth';
import { willSteps } from '@/constant/will';
import { useProgressStepStore } from '@/store/progress-steps';

function WillPage() {
  const { willMainStep } = useProgressStepStore();

  return (
    <>
      <section className='py-12'>
        <article className='mx-auto flex max-w-[1200px] flex-col gap-8 px-6 lg:flex-row lg:gap-[60px] xl:px-0'>
          <WillStepper steps={willSteps} />
          {!willMainStep && <FamilySection />}
          {willMainStep === 1 && <EstateSection />}
          {willMainStep === 2 && <GiftsSection />}
          {willMainStep === 3 && <ExecutorsSection />}
          {willMainStep === 4 && <ReviewSection />}
          {willMainStep === 5 && <WillDownload />}
        </article>
      </section>

      <div className='container max-w-[1200px] px-6 xl:p-0'>
        <Footer />
      </div>
    </>
  );
}

export default withAuth(WillPage);
