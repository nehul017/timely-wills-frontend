import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import dynamic from 'next/dynamic';
import React, { memo } from 'react';

import { elementsOptions } from '@/constant/checkout';
import { useAmountStore } from '@/store/payment';

import DynamicBreadcrumb from '../DynamicBreadcrumb';
import Footer from '../Footer';
import InfoPopup from '../InfoPopup';
import { Toaster } from '../ui/sonner';

const WillCheckoutForm = dynamic(
  () => import('@/components/checkout/WillCheckoutForm'),
  {
    ssr: false,
  },
);

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function CheckoutSection() {
  const { willAmount, isSubscription } = useAmountStore();

  return (
    <>
      <section className='mx-auto max-w-[1200px] px-6 xl:px-0'>
        <article className='relative items-center justify-between pt-[30px]'>
          <div>
            <DynamicBreadcrumb />
            <h1 className='mt-6 text-4xl font-bold leading-[50px] lg:mt-[30px]'>
              Checkout
            </h1>
          </div>
          <div className='absolute right-0 top-11'>
            <InfoPopup />
          </div>
        </article>

        <Elements
          key={isSubscription ? 'subscription' : 'one-time'}
          stripe={stripePromise}
          options={{
            ...elementsOptions,
            mode: 'payment',
            amount: willAmount * 100,
            currency: 'usd',
            payment_method_types: isSubscription
              ? ['card']
              : ['card', 'klarna', 'afterpay_clearpay'],
            ...(isSubscription && { setup_future_usage: 'on_session' }),
          }}
        >
          <WillCheckoutForm />
        </Elements>
      </section>

      <div className='container max-w-[1200px] px-6 xl:p-0'>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default memo(CheckoutSection);
