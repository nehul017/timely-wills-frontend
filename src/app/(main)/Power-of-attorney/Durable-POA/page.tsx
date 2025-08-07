'use client';

import Footer from '@/components/Footer';
import DurablePOASection from '@/components/power-of-attorney/durable-poa/DurablePOASection';
import POATopHeading from '@/components/power-of-attorney/POATopHeading';
import withAuth from '@/components/withAuth';

function DurablePoaPage() {
  return (
    <>
      <section className='mx-auto max-w-[1200px] px-6 text-[#010D04] xl:px-0'>
        <POATopHeading>
          Durable <span className='text-bright'>POA</span>
        </POATopHeading>
      </section>

      <section className='py-12'>
        <article className='mx-auto flex max-w-[1200px] flex-col gap-8 px-6 lg:flex-row lg:gap-[60px] xl:px-0'>
          <DurablePOASection />
        </article>
      </section>
      <div className='container max-w-[1200px] px-6 xl:p-0'>
        <Footer />
      </div>
    </>
  );
}

export default withAuth(DurablePoaPage);
