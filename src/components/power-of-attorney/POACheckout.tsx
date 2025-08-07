import Link from 'next/link';

import CheckmarkIcon from '@/assets/icons/checkmark';

import { Separator } from '../ui/separator';

function POACheckout() {
  return (
    <section className='mx-auto mb-16 flex w-fit flex-col gap-[30px] px-6 lg:flex-row'>
      <article className='mt-[65px] lg:w-[656px]'>
        <p className='mb-[56px] text-[25px] font-bold text-[#25D998]'>
          Power of Attorney
        </p>

        <h1 className='mb-[45px] text-3xl font-bold lg:text-[35px] lg:leading-[50px]'>
          Your life has many important aspects to manage.
        </h1>

        <p className='text-xl'>
          Creating a Power of Attorney (POA) allows your appointed agent to
          effectively manage your financial and medical decisions, ensuring your
          wishes are followed and providing clarity and support for your loved
          ones when you are unable to make those decisions yourself. Our
          comprehensive POA package includes a Medical POA, Durable Financial
          POA, and a Living Will, covering all aspects of your end-of-life and
          financial planning needs.
        </p>
      </article>

      <Separator className='h-[1px] bg-[#7e7e7e] lg:hidden' />

      <Separator
        orientation='vertical'
        className='mt-24 hidden h-[579px] bg-[#7e7e7e] lg:inline-flex'
      />

      <article className='flex flex-col lg:mt-[151px] lg:max-w-[547px]'>
        <ul className='mb-[64px] flex flex-col gap-[30px] text-[15px]'>
          <li className='flex gap-[19px]'>
            <CheckmarkIcon className='h-5 w-5 shrink-0' />
            <div>
              <span className='font-bold'>Quick and Easy Setup: </span>
              Complete your POA in as little as 10 minutes.
            </div>
          </li>

          <li className='flex gap-[19px]'>
            <CheckmarkIcon className='h-5 w-5 shrink-0' />
            <div>
              <span className='font-bold'>Comprehensive Coverage: </span>
              Includes Medical POA, Durable Financial POA, and Living Will.
            </div>
          </li>

          <li className='flex gap-[19px]'>
            <CheckmarkIcon className='h-5 w-5 shrink-0' />
            <div>
              <span className='font-bold'>Flexible and Updatable: </span>
              Enjoy unlimited updates for 12 months to keep your documents
              current.
            </div>
          </li>
        </ul>

        <div className='mx-auto max-w-[500px] rounded-[10px] border border-black bg-white p-[15px]'>
          <p className='text-[15px]'>
            Access to the your POA’s is granted once you’ve gone through
            checkout.{' '}
            <Link
              className='font-bold text-bright underline'
              href='Power-of-attorney/checkout'
            >
              Click here to go to checkout
            </Link>
          </p>
        </div>
      </article>
    </section>
  );
}

export default POACheckout;
