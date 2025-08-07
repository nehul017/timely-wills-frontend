'use client';

import BillingPaymentSection from '@/components/account-settings/BillingPaymentSection';
import ChangeEmailForm from '@/components/account-settings/ChangeEmailForm';
import ChangePasswordForm from '@/components/account-settings/ChangePasswordForm';
import DeleteAccountSection from '@/components/account-settings/DeleteAccountSection';
import { Toaster } from '@/components/ui/sonner';
import withAuth from '@/components/withAuth';
import Footer from '@/components/Footer';

function AccountSettingsPage() {
  return (
    <>
      <main className='flex flex-col pb-[75px] lg:flex-row'>
        <aside className='w-[500px] pl-[28px] pt-[60px]'>
          <h2 className='mb-[29px] text-[25px] font-bold lg:text-[35px]'>
            My Account Settings
          </h2>
          {/* <ul className='space-y-[15px]'>
            <li className='text-[20px] font-bold'>Email Address</li>
            <li className='text-[20px] font-bold'>Password</li>
            <li className='text-[20px] font-bold'>Billing & Payment</li>
            <li className='text-[20px] font-bold'>Delete My Account</li>
          </ul> */}
        </aside>
        <section className='mx-[28px] max-w-[350px] flex-grow self-center pt-[124px] lg:mx-0 lg:pl-[30px]'>
          <ChangeEmailForm />
          <ChangePasswordForm />
          {/* <BillingPaymentSection /> */}
          <DeleteAccountSection />
        </section>
        <Toaster />
      </main>
      <div className='container max-w-[1200px] px-6 xl:p-0'>
        <Footer />
      </div>
    </>
  );
}

export default withAuth(AccountSettingsPage);
