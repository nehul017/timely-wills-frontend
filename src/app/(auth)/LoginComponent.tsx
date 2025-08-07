'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import WarningIcon from '@/assets/icons/warning-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Separator } from '@/components/ui/separator';
import { loginSchema } from '@/schemas/auth';
import userAPI from '@/services/auth';
import { useAuthStore } from '@/store/user-info';

type FormData = z.infer<typeof loginSchema>;

function LoginComponent() {
  const { userInfo, setUserInfo } = useAuthStore();
  const [isLoading, setIsloading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const {
    handleSubmit,
    setError,
    formState: { errors },
    register,
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (userInfo && !isSigningUp) {
      router.push('/');
    }
  }, [userInfo, isSigningUp]);

  const onSubmit = async (data: FormData) => {
    setIsloading(true);
    setIsSigningUp(true);

    const { identifier, password } = data;
    try {
      await userAPI.login({ identifier, password });

      let  path = query ? '/Power-of-attorney' : '/';
      const userInfo = await userAPI.getUserInfo();
      if(userInfo?.payments?.length == 0){
         path = '/will/checkout' 
        }
      console.log(userInfo,"userInfo")

      setUserInfo(userInfo);
      router.push(path);
    } catch (err) {
      setError('password', {
        type: 'manual',
        message: 'Invalid email or password',
      });
      console.error(err);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <>
      <section className='mt-12 flex flex-col items-center justify-center px-4 lg:mt-[100px]'>

        <Card className='border-[rgba(0, 0, 0, 0.2)] rounded-2xl shadow-[0_0_14px_0_rgba(0,0,0,0.15)] lg:w-[56rem]'>
          <CardHeader className='text-center'>
            <CardTitle className='text-[25px] font-semibold'>
              Log in to your account
            </CardTitle>
          </CardHeader>
          <CardContent className='px-6 lg:px-[30px]'>
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div className='space-y-2'>
                <Label htmlFor='email' className='text-xs font-normal text-[#111111]'>
                  Enter your email
                </Label>
                <Input
                  {...register('identifier')}
                  id='email'
                  className={`h-12 border-[rgba(0, 0, 0, 0.2)] text-base placeholder:text-[#636B6599] ${errors.identifier && 'focus:ring-danger-outline'}`}
                  placeholder='Enter You Email'
                />
                {errors.identifier && (
                  <span className='flex items-center text-[10px] text-danger'>
                    <WarningIcon
                      className='mr-1 h-[9px] w-[9px]'
                      fill='#FF0000'
                    />
                    {errors.identifier.message}
                  </span>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='flex justify-between text-xs font-normal text-[#111111]'
                >
                  Enter password
                  <Link
                    href='/forgot-password'
                    className='text-xs font-semibold text-bright'
                  >
                    Forgot Password?
                  </Link>
                </Label>
                <PasswordInput
                  {...register('password')}
                  id='password'
                  className={`h-12 border-[rgba(0, 0, 0, 0.2)] text-base placeholder:text-[#636B6599] ${errors.password && 'focus:ring-danger-outline'}`}
                  placeholder='Enter Password'
                />
                {errors.password && (
                  <span className='flex items-center text-[10px] text-danger'>
                    <WarningIcon
                      className='mr-1 h-[9px] w-[9px]'
                      fill='#FF0000'
                    />
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Button
                isLoading={isLoading}
                type='submit'
                className='!mt-8 h-[52px] w-full bg-bright text-[16px] font-medium text-white'
              >
                Login
              </Button>
            </form>

            <div className='font-regular mt-8 text-center text-[16px] text-[#8D9395]'>
              Don’t have an account?{' '}
              <Link
                href={query ? '/signup?query=poa' : '/signup'}
                className='font-semibold text-bright'
              >
                Signup
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className='mx-auto my-[100px] max-w-[1200px] bg-[#010D041A]' />
    </>
  );
}

export default LoginComponent;
