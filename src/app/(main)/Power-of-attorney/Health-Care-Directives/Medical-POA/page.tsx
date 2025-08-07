'use client';

import Footer from '@/components/Footer';
import MedicalPOASection from '@/components/power-of-attorney/medical-poa/MedicalPOASection';
import POATopHeading from '@/components/power-of-attorney/POATopHeading';
import withAuth from '@/components/withAuth';

function MediaclPOAPage() {
  return (
    <>
      <section className='mx-auto max-w-[1200px] px-6 text-[#010D04] xl:px-0'>
        <POATopHeading>
          Medical <span className='text-bright'>POA</span>
        </POATopHeading>
      </section>

      <section className='py-12'>
        <article className='mx-auto flex max-w-[1200px] flex-col gap-8 px-6 lg:flex-row lg:gap-[60px] xl:px-0'>
          <MedicalPOASection />
        </article>
      </section>
      <div className='container max-w-[1200px] px-6 xl:p-0'>
        <Footer />
      </div>
    </>
  );
}

export default withAuth(MediaclPOAPage);
