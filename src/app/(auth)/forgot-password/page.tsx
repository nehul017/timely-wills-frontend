'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import WarningIcon from '@/assets/icons/warning-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { forgotPasswordSchema } from '@/schemas/auth';
import userAPI from '@/services/auth';
import { useAuthStore } from '@/store/user-info';
import { ErrorResponse } from '@/types';

type FormData = z.infer<typeof forgotPasswordSchema>;

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useAuthStore();
  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, [router, userInfo]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await userAPI.sendEmail(data.email as string);
      toast('', {
        position: 'top-center',
        description: (
          <div className='flex items-center gap-[6px]'>
            <WarningIcon fill='#010D04' className='rotate-180' />
            Please, check your email
          </div>
        ),
      });
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as ErrorResponse;
      toast('', {
        position: 'top-center',
        description: (
          <div className='flex items-center gap-[6px]'>
            <WarningIcon fill='#010D04' className='rotate-180' />
            {message}
          </div>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='reset-height flex flex-col items-center justify-center px-4'>
      <div>
        <h1 className='text-[25px] font-bold leading-9'>Reset your password</h1>
        <p className='w-[300px] text-xs'>
          Enter your email address to receive a link to reset your password.
        </p>

        <form className='mt-6 lg:w-[343px]' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-1'>
            <Label
              htmlFor='email'
              className='text-base font-normal text-[#8D9395]'
            >
              Enter your email
            </Label>
            <Input
              {...register('email')}
              id='forgot-email'
              className={`h-[40px] border-[#8D9395] bg-transparent text-base ${errors.email && 'focus:ring-danger-outline'}`}
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
            className='mt-[26px] h-[46px] w-full bg-bright text-[16px] font-medium text-white'
          >
            Submit
          </Button>

          <Link
            className='mx-auto mt-5 block text-center text-[15px] font-medium text-bright'
            href='/login'
          >
            Back to Sign In
          </Link>
        </form>
      </div>
      <Toaster />
    </section>
  );
}

export default ForgotPasswordPage;
