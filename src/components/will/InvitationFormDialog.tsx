'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { inviteSchema } from '@/schemas/invite';
import inviteAPI, { Promocode } from '@/services/invite-partner';
import { useAuthStore } from '@/store/user-info';

import Alert from '../ui/alert';
import { Button } from '../ui/button';

type FormData = z.infer<typeof inviteSchema>;

function InvitationFormDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [promocodes, setPromocodes] = useState<Promocode[] | null>(null);
  const [open, setOpen] = useState(false);
  const { userInfo } = useAuthStore();
  const shouldInvite = promocodes?.some((item) => !item.isSent);

  const methods = useForm<FormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (userInfo?.id) {
      inviteAPI
        .getPromocodes(userInfo.id)
        .then(setPromocodes)
        .catch((error) => console.error(error));
    }
  }, [userInfo?.id]);

  const {
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const result = await inviteAPI.invite({
        email: data.email,
        userId: userInfo?.id as number,
      });

      setPromocodes(result);
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!shouldInvite) return null;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger className='mt-[30px]'>
        <Alert>
          Send your partner the invitation email to create an account (click
          here)
        </Alert>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>Invite your partner</DialogTitle>
        <DialogDescription className='text-[#010D0499]'>
          {`You have paid for your partners estate plan. We can send them an
          email invitation directly, or you can directly share the unique
          discount code - or you can do BOTH! :)`}
        </DialogDescription>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormField
              control={methods.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <Label className='mt-6 block text-xs'>
                    Enter your partner’s email
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.email && 'focus:ring-danger-outline'}`}
                      placeholder='Email goes here'
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-normal' />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name='promocode'
              render={({ field }) => (
                <FormItem>
                  <Label className='mt-6 block text-xs'>
                    Share the code directly
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      value={promocodes?.map((item) => item.code).join(', ')}
                      readOnly
                      className='mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12'
                      placeholder='Share the code directly'
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-normal' />
                </FormItem>
              )}
            />

            <div className='mt-6 flex flex-col gap-3 lg:mt-8 lg:flex-row lg:justify-between lg:space-y-0'>
              <Button
                onClick={() => setOpen(false)}
                variant='outline'
                className='order-2 h-[52px] w-full border-bright text-lg font-semibold text-bright hover:bg-white hover:text-bright lg:order-1 lg:w-[136px]'
              >
                Do it later
              </Button>
              <Button
                isLoading={isLoading}
                className='order-1 h-[52px] w-full bg-bright text-lg font-semibold text-white lg:order-2 lg:w-[206px]'
              >
                Send Invite
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default InvitationFormDialog;
