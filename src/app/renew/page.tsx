'use client';

import '../globals.css';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

import RenewIcon from '@/assets/icons/renew-icon';
import Header from '@/components/Header';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import withAuth from '@/components/withAuth';
import { elementsOptions } from '@/constant/checkout';
import { Prices } from '@/constant/will';

import RenewCheckout from './RenewCheckout';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function RenewPage() {
  return (
    <>
      <Header />
      <main className='success mx-auto flex max-w-[700px] flex-col items-center justify-center px-6 xl:px-0'>
        <RenewIcon className='mb-8' />
        <h1 className='mb-8 text-center text-[30px] font-bold leading-[50px] lg:text-[35px]'>
          It’s time to renew your membership
        </h1>
        <p className='mb-[68px] text-center text-xl'>
          Your free 1 year membership access is up. In order to get back into
          your account with unlimited edits, updates, and storage, you will need
          to renew your membership.
        </p>

        <p className='mb-8 text-[25px] font-bold'>{`$${Prices.SUBSCRIPTION}/ year`}</p>

        <Dialog>
          <DialogTrigger className='h-[42px] w-[300px] rounded-lg bg-bright text-lg font-semibold text-white'>
            Renew Membership
          </DialogTrigger>
          <DialogOverlay />
          <DialogContent isCloseIconHidden className='lg:w-[584px]'>
            <DialogTitle className='text-xl lg:text-xl lg:font-bold'>
              Summary
            </DialogTitle>
            <DialogDescription className='flex items-center justify-between text-lg font-semibold text-[#010D04]'>
              <span>Timely Yearly Subscription</span>
              <span>{`$${Prices.SUBSCRIPTION} / year`}</span>
            </DialogDescription>

            <Separator className='my-6' />

            <Elements
              stripe={stripePromise}
              options={{
                ...elementsOptions,
                mode: 'payment',
                amount: Prices.SUBSCRIPTION * 100,
                currency: 'usd',
                payment_method_types: ['card'],
                setup_future_usage: 'on_session',
              }}
            >
              <RenewCheckout />
            </Elements>
          </DialogContent>
        </Dialog>
      </main>
      <Toaster />
    </>
  );
}

export default withAuth(RenewPage);
