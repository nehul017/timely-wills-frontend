'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import WarningIcon from '@/assets/icons/warning-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateEmailSchema } from '@/schemas/auth';
import userAPI from '@/services/auth';
import { useAuthStore } from '@/store/user-info';
import { Toaster } from 'sonner';

type FormData = z.infer<typeof updateEmailSchema>;

export default function ChangeEmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUserInfo, userInfo } = useAuthStore();
  const {
    formState: { errors },
    register,
    reset,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const res = await userAPI.updateEmail(
        userInfo?.id as number,
        data.email as string,
      );
      reset({ email: '' });
      setUserInfo(res);
      toast('', {
        position: 'top-center',
        description: (
          <div className='flex items-center gap-[6px]'>
            <WarningIcon fill='#010D04' className='rotate-180' />
            Email is updated
          </div>
        ),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mb-[44px]'>
      <h3 className='mb-[4px] text-[20px] font-bold'>
        Change Your Email Address
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-[13px]'>
          <Label htmlFor='current-email' className='text-[15px] font-normal'>
            Current email address
          </Label>
          <Input
            className={`h-[40px] border-[#8D9395] text-[15px] ${errors.email && 'focus:ring-danger-outline'}`}
            value={userInfo?.email || "Current email not found!"}
            readOnly
          />
        </div>
        <div className='mb-[13px]'>
          <Label htmlFor='new-email' className='text-[15px] font-normal'>
            New email address
          </Label>
          <Input
            {...register('email')}
            id='new-email'
            className={`h-[40px] border-[#8D9395] text-[15px] ${errors.email && 'focus:ring-danger-outline'}`}
          />
          {errors.email && (
            <span className='flex items-center text-[10px] text-danger'>
              <WarningIcon className='mr-1 h-[9px] w-[9px]' fill='#FF0000' />
              {errors.email.message}
            </span>
          )}
        </div>
        <Button
          isLoading={isLoading}
          type='submit'
          className='h-[37px] w-[222px] bg-[#50CD73] text-[20px] font-medium text-white'
        >
          Update
        </Button>
      </form>
      <Toaster />
    </div>
  );
}
