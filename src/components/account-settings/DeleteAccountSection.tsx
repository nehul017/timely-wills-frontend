'use client';

import { toast } from 'sonner';

import WarningIcon from '@/assets/icons/warning-icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import userAPI from '@/services/auth';

import { Toaster } from '../ui/sonner';

export default function DeleteAccountSection() {
  const handleClick = async () => {
    try {
      await userAPI.sendDeleteRequest();
      toast('', {
        position: 'top-center',
        description: (
          <div className='flex items-center gap-[6px]'>
            <WarningIcon fill='#010D04' className='rotate-180' />
            Please check your email to confirm deleting account
          </div>
        ),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3 className='text-[20px] font-bold'>Delete My Account</h3>
      <p className='mb-[13px] text-[15px] font-normal'>
        Deleting your account is an irreversible action, and you will lose
        access to your documents and dashboard for future edits and updates.
      </p>

      <Dialog>
        <DialogTrigger className='h-[37px] w-[185px] rounded-md bg-[#D58787] text-xl font-medium text-white'>
          Delete Account
        </DialogTrigger>
        <DialogOverlay />
        <DialogContent className='p-6 lg:p-[30px]' isCloseIconHidden>
          <DialogTitle className='mb-8'>Request Account Deletion</DialogTitle>

          <div className='flex'>
            <WarningIcon className='mr-2 shrink-0' />

            <div>
              <DialogDescription className='mb-6'>
                Are you sure you want to delete your account? The information on
                your account will be <strong>permanently deleted</strong>, and
                you won’t be able to access it again.
              </DialogDescription>

              <DialogDescription className='mb-6'>
                To be sure it’s you requesting deletion of your account, you
                will receive a confirmation email for this request. When you
                click the link in this email, your request will be approved.
              </DialogDescription>

              <DialogDescription className='mb-6'>
                There is a 14-day grace period. If you change your mind within
                14 days, your account will be restored. Otherwise, your account
                will be <strong>permanently deleted</strong>.
              </DialogDescription>
            </div>
          </div>

          <div className='flex flex-col space-y-3 lg:flex-row lg:justify-end lg:space-x-3 lg:space-y-0'>
            <DialogTrigger className='h-[52px] w-full rounded-lg border border-bright text-lg font-semibold text-bright lg:w-[113px]'>
              Cancel
            </DialogTrigger>

            <DialogTrigger
              onClick={handleClick}
              className='h-[52px] w-full rounded-lg bg-bright text-lg font-semibold text-white lg:w-[246px]'
            >
              Submit Deletion Request
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
