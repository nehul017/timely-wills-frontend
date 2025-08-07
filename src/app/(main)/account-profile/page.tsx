'use client';

import withAuth from '@/components/withAuth';
import ProfileForm from '@/components/account-profile/profileForm';
import { Toaster } from '@/components/ui/sonner';
import Footer from '@/components/Footer';

function AccountProfileForm() {

  return (
    <div>
      <main className='flex flex-col pb-[75px] lg:flex-row min-h-[90vh]'>
        {/* <aside className='w-fit lg:w-[500px] pl-[28px] pt-[60px]'>
          <ul className='space-y-[15px] w-fit'>
            <li className='text-[20px] font-bold'>Main Info</li>
            <li className='text-[20px] font-bold'>Address Info</li>
            <li className='text-[20px] font-bold'>Relationship Info</li>
          </ul>
        </aside> */}
        <section className='mx-[28px] w-[80%] lg:max-w-full flex-grow pt-[80px] lg:mx-0 lg:pl-[30px] lg:pr-10'>
          <div className='flex flex-col justify-center items-center w-full'>
            <h2 className='mb-[29px] text-[25px] font-bold lg:text-[35px]'>
              My Profile Settings
            </h2>
            <div className='flex flex-col justify-center items-center w-full'>
              <ProfileForm />
            </div>
          </div>
        </section>
        <Toaster />
      </main>
      <div className='container max-w-[1200px] px-6 xl:p-0'>
        <Footer />
      </div>
    </div>
  );
}
export default withAuth(AccountProfileForm);
