'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import WarningIcon from '@/assets/icons/warning-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Separator } from '@/components/ui/separator';
import { registerSchema } from '@/schemas/auth';
import userAPI from '@/services/auth';
import { useAuthStore } from '@/store/user-info';

type FormData = z.infer<typeof registerSchema>;

function SignupComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { userInfo, setUserInfo } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const {
    formState: { errors },
    register,
    handleSubmit,
    setError,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (userInfo && !isSigningUp) {
      router.push('/');
    }
  }, [userInfo, isSigningUp]);

  const handleClickSubmitButton = () => {
    const inputValue = watch('email').trim();

    if (window.tolt_referral && inputValue) {
      window.tolt.signup(inputValue);
    }
  };

  const onSubmit = async (data: FormData) => {
    const { email, password, firstName, middleName, lastName } = data;

    setIsLoading(true);
    setIsSigningUp(true);

    try {
      const response = await userAPI.signUp({
        email,
        password,
        username: email,
        firstName,
        middleName,
        lastName,
      });

      router.push('/about?new=1');
      setUserInfo(response.user);
    } catch (err) {
      setError('email', {
        type: 'manual',
        message: 'Email alredy in use',
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className='mt-12 flex flex-col items-center justify-center px-4 lg:mt-[100px]'>
        <h1 className='mb-12 text-center text-3xl font-bold lg:text-[36px]'>
          <span className='text-bright'>Create your</span> Timely Account 👋
        </h1>

        <Card className='max-w-[56rem] border-[rgba(0, 0, 0, 0.2)] rounded-2xl shadow-[0_0_14px_0_rgba(0,0,0,0.15)]'>
          <CardHeader className='text-center'>
            <CardTitle className='mb-2 text-xl font-semibold lg:text-[26px]'>
              Sign Up
            </CardTitle>

            <p className='text-sm text-[#010D0499]'>
              Thousands of Americans choose Timely for a quick, affordable, and
              easy way to protect their future.
            </p>
          </CardHeader>

          <CardContent className='px-6 lg:px-[30px]'>
            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div className='space-y-1'>
                <Label htmlFor='firstName' className='text-xs font-normal'>
                  First Name
                </Label>
                <Input
                  {...register('firstName')}
                  id='firstName'
                  className={`h-12 border-[rgba(0, 0, 0, 0.2)] text-[16px] font-normal placeholder:text-[#636B6599] ${errors.firstName?.message && 'focus:ring-[#E51A2980]'}`}
                  placeholder='First Name'
                />
                {errors.firstName && (
                  <span className='flex items-center text-[10px] text-danger'>
                    <WarningIcon
                      className='mr-1 h-[9px] w-[9px]'
                      fill='#FF0000'
                    />
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className='space-y-1'>
                <Label htmlFor='middleName' className='text-xs font-normal'>
                  Middle Name (optional)
                </Label>
                <Input
                  {...register('middleName')}
                  id='middleName'
                  className={`h-12 border-[rgba(0, 0, 0, 0.2)] text-[16px] font-normal placeholder:text-[#636B6599] ${errors.middleName?.message && 'focus:ring-[#E51A2980]'}`}
                  placeholder='Middle Name'
                />
                {errors.middleName && (
                  <span className='flex items-center text-[10px] text-danger'>
                    <WarningIcon
                      className='mr-1 h-[9px] w-[9px]'
                      fill='#FF0000'
                    />
                    {errors.middleName.message}
                  </span>
                )}
              </div>

              <div className='space-y-1'>
                <Label htmlFor='lastName' className='text-xs font-normal'>
                  Last Name
                </Label>
                <Input
                  {...register('lastName')}
                  id='lastName'
                  className={`h-12 border-[rgba(0, 0, 0, 0.2)] text-[16px] font-normal placeholder:text-[#636B6599] ${errors.lastName?.message && 'focus:ring-[#E51A2980]'}`}
                  placeholder='Last Name'
                />
                {errors.lastName && (
                  <span className='flex items-center text-[10px] text-danger'>
                    <WarningIcon
                      className='mr-1 h-[9px] w-[9px]'
                      fill='#FF0000'
                    />
                    {errors.lastName.message}
                  </span>
                )}
              </div>

              <div className='space-y-1'>
                <Label htmlFor='email' className='text-xs font-normal'>
                  Enter your email
                </Label>
                <Input
                  {...register('email')}
                  id='email'
                  className={`h-12 border-[rgba(0, 0, 0, 0.2)] text-[16px] font-normal placeholder:text-[#636B6599] ${errors.email?.message && 'focus:ring-[#E51A2980]'}`}
                  placeholder='Enter Your Email'
                />
                {errors.email && (
                  <span className='flex items-center text-[10px] text-danger'>
                    <WarningIcon
                      className='mr-1 h-[9px] w-[9px]'
                      fill='#FF0000'
                    />
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className='space-y-1'>
                <Label htmlFor='password' className='text-xs font-normal'>
                  Create a password
                </Label>
                <PasswordInput
                  {...register('password')}
                  id='password'
                  className={`h-12 border-[rgba(0, 0, 0, 0.2)] text-[16px] font-normal placeholder:text-[#636B6599] ${errors.password?.message && 'focus:ring-[#E51A2980]'}`}
                  placeholder='Create a password'
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
                onClick={handleClickSubmitButton}
                ref={buttonRef}
                isLoading={isLoading}
                type='submit'
                className='!mt-8 w-full bg-bright text-[16px] font-medium text-white'
              >
                Sign Up
              </Button>
            </form>

            <p className='mt-[18px] text-sm text-[#010D0499]'>
              By signing up you agree to Timely’s{' '}
              <a
                target='_blank'
                href='https://www.withtimely.com/terms-of-service'
                rel='noreferrer'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                target='_blank'
                href='https://www.withtimely.com/privacy-policy'
                rel='noreferrer'
              >
                Privacy Policy
              </a>
              .
            </p>

            <div className='mt-8 text-center text-sm font-normal text-[#010D0499] lg:text-[16px]'>
              Already have an account?{' '}
              <Link href='/login' className='font-semibold text-bright'>
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
      <Separator className='mx-auto my-[100px] max-w-[1200px] bg-[#010D041A]' />
    </>
  );
}

export default SignupComponent;
