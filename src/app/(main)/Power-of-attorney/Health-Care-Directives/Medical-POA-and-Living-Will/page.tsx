'use client';

import Footer from '@/components/Footer';
import MedicalPOALivingWillSection from '@/components/power-of-attorney/medical-poa-living-will/MedicalPOALivingWillSection';
import POATopHeading from '@/components/power-of-attorney/POATopHeading';
import withAuth from '@/components/withAuth';

function MedicalPOALivingWillPage() {
  return (
    <>
      <section className='mx-auto max-w-[1200px] px-6 text-[#010D04] xl:px-0'>
        <POATopHeading>
          Medical POA <span className='text-bright'>& Living Will</span>
        </POATopHeading>
      </section>

      <section className='py-12'>
        <article className='mx-auto flex max-w-[1200px] flex-col gap-8 px-6 lg:flex-row lg:gap-[60px] xl:px-0'>
          <MedicalPOALivingWillSection />
        </article>
      </section>
      <div className='container max-w-[1200px] px-6 xl:p-0'>
        <Footer />
      </div>
    </>
  );
}

export default withAuth(MedicalPOALivingWillPage);
