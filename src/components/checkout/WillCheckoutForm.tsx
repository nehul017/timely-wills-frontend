'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import SuccessIcon from '@/assets/icons/success';
import WarningIcon from '@/assets/icons/warning-icon';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio';
import { Separator } from '@/components/ui/separator';
import { willListItems } from '@/constant/checkout';
import { Prices } from '@/constant/will';
import useFetchAbout from '@/hooks/about/use-fetch-about';
import useStripeCheckout from '@/hooks/checkout/use-stripe-checkout';
import { willCheckoutSchema } from '@/schemas/checkout';
import paymentApi from '@/services/payment';
import { useAboutStore } from '@/store/about';
import { useAmountStore } from '@/store/payment';
import { useAuthStore } from '@/store/user-info';

import CheckoutFields from './CheckoutFields';
import SatisfactionCard from './SatisfactionCard';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import Spinner from '../ui/spinner';

type FormData = z.infer<typeof willCheckoutSchema>;

function WillCheckoutForm() {
  const {
    willAmount,
    updateWillAmount,
    discount,
    updateIsSubscription,
    isSubscription,
  } = useAmountStore();
  const {
    elements,
    errorMessage,
    isSubmitedForm,
    loading,
    setErrorMessage,
    setIsSubmitedForm,
    stripe,
    customError,
  } = useStripeCheckout();
  const router = useRouter();
  const { userInfo } = useAuthStore();
  const { partner } = useAboutStore();
  const { fetchAbout } = useFetchAbout();
  const searchParams = useSearchParams();
  const param = searchParams.get('download');
  const pathName = usePathname();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isSubNew, setIsSubNew] = useState<boolean>(isSubscription ?? false);

  useEffect(() => {
    fetchAbout();
  }, []);

  useEffect(() => {
    if (willAmount !== Prices.MY_PLAN) {
      updateWillAmount(Prices.MY_PLAN);
    }
  }, []);

  const methods = useForm<FormData>({
    resolver: zodResolver(willCheckoutSchema),
    defaultValues: {
      promocode: '',
      cardHolderName: '',
      isWillCouple: false,
    },
    mode: 'onChange',
  });
  const { watch, setValue } = methods;

  useEffect(() => {
    updateIsSubscription(isSubNew);
    return setValue('isSub', isSubNew); // keeps RHF synced with state
  }, []);

  const handleSubmit = async (data: FormData) => {
    if (!stripe || !elements) {
      setErrorMessage(customError);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(customError);
      return;
    }

    setIsSubmitedForm(true);

    let clientSecret: string;
    const { cardHolderName, ...bodyData } = data;

    try {
      clientSecret = await paymentApi.post({
        ...bodyData,
        isWill: true,
      });
    } catch (error) {
      toast('', {
        position: 'top-center',
        description: (
          <div className='flex items-center gap-[6px] text-danger'>
            <WarningIcon fill='#E51A29' className='rotate-180' />
            {customError}
          </div>
        ),
      });
      setIsSubmitedForm(false);
      return;
    }

    if (clientSecret) {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: cardHolderName,
              email: userInfo?.email as string,
            },
          },
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL?.replace('back/api', 'will-success')}`,
        },
      });

      if (error) {
        setErrorMessage(customError);
        setIsSubmitedForm(false);
        return;
      }
    }

    if (pathName.includes('Power-of-attorney')) {
      router.push('/poa-success');
    } else {
      router.push(param ? '/' : '/will-success');
    }

    setIsSubmitedForm(false);
    setErrorMessage('');
  };

  return (
    <Form {...methods}>
      <form
        className='mt-8 flex flex-col gap-8 lg:mt-12 lg:flex-row'
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
        <div className='h-fit w-full rounded-lg border border-[#8d9395] bg-white p-6 lg:w-[687px] lg:p-[30px]'>
          <div>
            <h2 className='h2'>Legal Will & Testament</h2>
            <ul className='mt-2 space-y-2 text-sm'>
              {willListItems.map((item) => (
                <li key={item} className='flex items-center'>
                  <SuccessIcon className='mr-[6px] shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
            <Separator className='my-6' />
          </div>

          <div>
            <h3 className='h3 mb-2'>
              {`Change your Last Will any time, for just $${Prices.SUBSCRIPTION} a year`}
            </h3>
            <p className='text-sm'>
              {`Traditionally once you’ve signed your will, you’d need to pay to
              update it. Instead, for just $${Prices.SUBSCRIPTION} a year`}
              <em>(less than $0.80/day!)</em>, you can make unlimited changes,
              along with unlimited access to your Timely digital vault.
            </p>

            <FormField
              control={methods.control}
              name='isSub'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      className='mt-6 gap-6'
                      onValueChange={(value) =>
                        field.onChange(value === 'unlimited')
                      }
                    >
                      <Label
                        htmlFor='unlimited'
                        className={`flex items-center space-x-[16px] rounded-lg border border-[#8d9395] p-5 lg:space-x-5 ${field.value === true ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                      >
                        <RadioGroupItem
                          value='unlimited'
                          id='unlimited'
                          className='shrink-0'
                          checked={isSubNew === true}
                          onClick={() => setIsSubNew(true)}
                        />
                        <div>
                          <div className='border-gradient m-0 mb-2 h-[33px]'>
                            <span className='block w-[130px] rounded-md bg-[#DBFFE5] px-0 py-[6px] text-center text-sm font-semibold'>
                              Most Popular
                            </span>
                          </div>

                          <p className='mb-1 text-[16px] font-semibold leading-6'>
                            {`Yes, I want unlimited changes & support for
                            $${Prices.SUBSCRIPTION} / year`}
                          </p>
                          <p className='text-sm font-normal'>
                            {`The first year is free, the next time you get
                            charged will be ${dayjs(new Date()).add(1, 'year').format('DD MMMM YYYY')}`}
                          </p>
                        </div>
                      </Label>

                      <Label
                        htmlFor='limited'
                        className={`flex items-center space-x-[16px] rounded-lg border border-[#8d9395] p-5 lg:space-x-5 ${field.value === false ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                      >
                        <RadioGroupItem
                          value='limited'
                          id='limited'
                          className='shrink-0'
                          checked={isSubNew === false}
                          onClick={() => setIsSubNew(false)}
                        />
                        <div>
                          <p className='mb-1 text-[16px] font-semibold leading-6'>
                            No, I don’t want unlimited changes for when I need
                            an update
                          </p>
                          <p className='text-sm font-normal'>
                            {`If you change your will after ${dayjs(new Date()).add(1, 'year').format('DD MMMM YYYY')}, you’ll need to pay $99 for a new one.`}
                          </p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {partner.fullName && <Separator className='my-6' />}
          </div>

          <div>
            <p className='mt-6 text-sm font-semibold'>For your partner</p>

            <FormField
              control={methods.control}
              name='isWillCouple'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Label
                      htmlFor='partner-will'
                      className={`mt-3 flex h-[76px] items-center space-x-[16px] rounded-lg border border-[#8d9395] p-5 lg:space-x-5 ${field.value ? 'bg-[#DBFFE5B2] ring-2 ring-[#25D99880]' : undefined}`}
                    >
                      <Checkbox
                        onClick={() =>
                          updateWillAmount(
                            field.value
                              ? willAmount - Prices.PARTNERS_PLAN
                              : willAmount + Prices.PARTNERS_PLAN,
                          )
                        }
                        className='rounded-full border-none bg-[#DEE0DF99] data-[state=checked]:border-bright data-[state=checked]:bg-bright'
                        id='partner-will'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />

                      <div className='flex w-full items-center justify-between'>
                        <p className='text-[16px] font-semibold leading-6'>
                          Partners Estate Plan
                        </p>
                        <p className='flex flex-col items-end text-lg font-semibold'>
                          <span className='h-[15px] text-[10px] font-normal text-[#010D0499] line-through'>
                            {`$${Prices.MY_PLAN}`}
                          </span>
                          <span>{`$${Prices.PARTNERS_PLAN}`}</span>
                        </p>
                      </div>
                    </Label>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className='h-fit w-full rounded-lg border border-[#8d9395] bg-white p-6 lg:w-[481px] lg:p-[30px]'>
            <div className='mb-6 space-y-6'>
              <h2 className='h3'>Summary</h2>
              <p className='flex justify-between text-[16px] font-semibold'>
                <span>Last will</span>
                <span className='text-lg'>{`$${Prices.MY_PLAN}`}</span>
              </p>

              {watch('isWillCouple') && (
                <p className='flex justify-between text-[16px] font-semibold'>
                  <span>Partners Estate Plan</span>
                  <span className='text-lg'>{`$${Prices.PARTNERS_PLAN}`}</span>
                </p>
              )}

              {watch('isSub') && (
                <p className='max-w-[322px] text-xs leading-5'>
                  {`Unlimited changes & expert review plan auto-renews at $${Prices.SUBSCRIPTION} per year (first year is free)`}
                </p>
              )}

              {!discount || (
                <p className='flex justify-between text-[16px] font-semibold text-bright'>
                  <span>Discount applied: </span>
                  <span className='text-lg'>{`-$${discount.toFixed(2)}`}</span>
                </p>
              )}

              <p className='flex justify-between text-[16px] font-semibold text-bright'>
                <span>Total</span>
                <span className='text-lg'>{`$${(willAmount - discount).toFixed(2)}`}</span>
              </p>

              <Separator />
            </div>

            <CheckoutFields
              methods={methods}
              onPaymentElementChange={setIsPaymentComplete}
            />

            <Button
              isLoading={isSubmitedForm}
              className='mt-6 h-[52px] w-full bg-bright text-lg font-semibold text-white'
              type='submit'
              disabled={!methods.formState.isValid || !isPaymentComplete}
            >
              Confirm & pay
            </Button>

            {errorMessage && (
              <p className='mt-2 text-sm text-danger'>{errorMessage}</p>
            )}

            <SatisfactionCard />
          </div>
        )}
      </form>
    </Form>
  );
}

export default WillCheckoutForm;
