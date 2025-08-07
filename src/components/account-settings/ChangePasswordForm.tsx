import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import WarningIcon from '@/assets/icons/warning-icon';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { changePasswordSchema } from '@/schemas/auth';
import userAPI from '@/services/auth';

type FormData = z.infer<typeof changePasswordSchema>;
interface ErrorResponse {
  error: {
    message: string;
  };
}

export default function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const res = await userAPI.updatePassword(data);

      localStorage.setItem('jwt', res.jwt);
      reset();

      toast('', {
        description: (
          <div className='flex items-center gap-[6px]'>
            <WarningIcon fill='#010D04' className='rotate-180' />
            Password is updated
          </div>
        ),
      });
    } catch (err) {
      const error = err as AxiosError;
      const data = error.response?.data as ErrorResponse;
      setError('currentPassword', {
        type: 'manual',
        message: data.error.message,
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mb-[59px]'>
      <h3 className='mb-[4px] text-[20px] font-bold'>Change Your Password</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-[21px]'>
          <Label htmlFor='current-password' className='text-[15px] font-normal'>
            Current password
          </Label>
          <PasswordInput
            {...register('currentPassword')}
            id='current-password'
            className={`border-[#8D9395] text-[15px] font-normal ${errors.currentPassword && 'focus:ring-danger-outline'}`}
          />
          {errors.currentPassword && (
            <span className='flex items-center text-[10px] text-danger'>
              <WarningIcon className='mr-1 h-[9px] w-[9px]' fill='#FF0000' />
              {errors.currentPassword.message}
            </span>
          )}
        </div>
        <div className='mb-[21px]'>
          <Label htmlFor='new-password' className='text-[15px] font-normal'>
            New password
          </Label>
          <PasswordInput
            {...register('password')}
            id='new-password'
            className={`border-[#8D9395] text-[15px] font-normal ${errors.password && 'focus:ring-danger-outline'}`}
          />
          {errors.password && (
            <span className='flex items-center text-[10px] text-danger'>
              <WarningIcon className='mr-1 h-[9px] w-[9px]' fill='#FF0000' />
              {errors.password.message}
            </span>
          )}
        </div>
        <div className='mb-[13px]'>
          <Label
            htmlFor='confirm-new-password'
            className='text-[15px] font-normal'
          >
            Confirm new password
          </Label>
          <PasswordInput
            {...register('passwordConfirmation')}
            id='confirm-new-password'
            className={`border-[#8D9395] text-[15px] font-normal ${errors.passwordConfirmation && 'focus:ring-danger-outline'}`}
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
          className='h-[37px] w-[222px] bg-[#50CD73] text-[20px] font-medium text-white'
        >
          Update
        </Button>
      </form>
    </div>
  );
}
