import Link from 'next/link';
import React from 'react';

import CheckmarkIcon from '@/assets/icons/checkmark';

import { Separator } from '../ui/separator';

function DigitalPreview() {
  return (
    <section className='mb-16 flex flex-col gap-9 lg:flex-row lg:gap-[77px]'>
      <article className='mt-[65px] lg:w-[656px]'>
        <p className='mb-[56px] text-[25px] font-bold text-[#25D998]'>
          Digital Vault
        </p>

        <h1 className='mb-[45px] text-3xl font-bold lg:text-[35px] lg:leading-[50px]'>
          Your life has important documents to manage, store them in your Timely
          digital vault.
        </h1>

        <p className='text-xl'>
          Unlock access to a secure place to store and share your digital life.
          Protect your priceless content like photos, videos, account
          credentials, and important documents. Experience peace of mind knowing
          you control who can access your digital treasures. Upgrade now to
          secure your online life.
        </p>
      </article>

      <Separator className='h-[1px] bg-[#7e7e7e] lg:hidden' />

      <Separator
        orientation='vertical'
        className='mt-24 hidden h-[579px] bg-[#7e7e7e] lg:inline-flex'
      />

      <article className='lg:mt-[151px] lg:w-[547px]'>
        <ul className='mb-[64px] flex flex-col gap-[30px] text-[15px]'>
          <li className='flex gap-[19px]'>
            <CheckmarkIcon className='h-5 w-5 shrink-0' />
            <div>
              <span className='font-bold'>End-to-End Encryption: </span>
              Ensures your data is secure and private, accessible only by you
              and those you authorize.
            </div>
          </li>

          <li className='flex gap-[19px]'>
            <CheckmarkIcon className='h-5 w-5 shrink-0' />
            <div>
              <span className='font-bold'>Multi-Device Access: </span> Sync your
              vault across multiple devices, allowing you to access your
              important files anytime, anywhere.
            </div>
          </li>

          <li className='flex gap-[19px]'>
            <CheckmarkIcon className='h-5 w-5 shrink-0' />
            <div>
              <span className='font-bold'>Custom Access Controls: </span>
              Set specific permissions for different users, giving you full
              control over who can view or edit your stored content.
            </div>
          </li>
        </ul>

        <div className='mx-auto max-w-[500px] rounded-[10px] border border-black bg-white p-[15px]'>
          <p className='text-[15px]'>
            Access to the digital vault is granted once you’ve gone through
            checkout.{' '}
            <Link
              className='font-bold text-bright underline'
              href='will/checkout'
            >
              Click here to go to checkout
            </Link>
          </p>
        </div>
      </article>
    </section>
  );
}

export default DigitalPreview;
