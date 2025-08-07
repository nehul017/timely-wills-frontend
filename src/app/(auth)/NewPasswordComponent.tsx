'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import WarningIcon from '@/assets/icons/warning-icon';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { newPasswordSchema } from '@/schemas/auth';
import userAPI from '@/services/auth';
import { useAuthStore } from '@/store/user-info';

type FormData = z.infer<typeof newPasswordSchema>;

function NewPasswordComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo, setUserInfo } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
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
      const res = await userAPI.resetPassword({ ...data, code });

      setUserInfo(res.user);
      localStorage.setItem('jwt', res.jwt);
      router.push('/');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='reset-height flex flex-col items-center justify-center px-4'>
      <div>
        <h1 className='text-[25px] font-bold leading-9'>Create new Password</h1>

        <form
          className='mt-6 space-y-[15px] lg:w-[343px]'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='space-y-1'>
            <Label className='text-base font-normal text-[#8D9395]'>
              New password
            </Label>
            <PasswordInput
              {...register('password')}
              className={`h-[40px] border-[#8D9395] bg-transparent text-base ${errors.password && 'focus:ring-danger-outline'}`}
            />
            {errors.password && (
              <span className='flex items-center text-[10px] text-danger'>
                <WarningIcon className='mr-1 h-[9px] w-[9px]' fill='#FF0000' />
                {errors.password.message}
              </span>
            )}
          </div>
          <div className='space-y-1'>
            <Label className='text-base font-normal text-[#8D9395]'>
              Confirm new password
            </Label>
            <PasswordInput
              {...register('passwordConfirmation')}
              className={`h-[40px] border-[#8D9395] bg-transparent text-base ${errors.passwordConfirmation && 'focus:ring-danger-outline'}`}
            />
            {errors.passwordConfirmation && (
              <span className='flex items-center text-[10px] text-danger'>
                <WarningIcon className='mr-1 h-[9px] w-[9px]' fill='#FF0000' />
                {errors.passwordConfirmation.message}
              </span>
            )}
          </div>
          <Button
            isLoading={isLoading}
            type='submit'
            className='mt-[26px] h-[46px] w-full bg-bright text-[16px] font-medium text-white'
          >
            Login
          </Button>
        </form>
      </div>
    </section>
  );
}

export default NewPasswordComponent;
