import { AxiosError } from 'axios';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import WarningIcon from '@/assets/icons/warning-icon';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useStripeCheckout from '@/hooks/checkout/use-stripe-checkout';
import promocodeAPI from '@/services/discount';
import { useAmountStore } from '@/store/payment';
import { ErrorResponse } from '@/types';

import { Button } from '../ui/button';
import { Toaster } from '../ui/sonner';

type Props<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  isHidePromocode?: boolean;
  onPaymentElementChange?: (isComplete: boolean) => void;
};

function CheckoutFields<T extends FieldValues>({
  methods,
  isHidePromocode,
  onPaymentElementChange,
}: Props<T>) {
  const { PaymentElement } = useStripeCheckout();
  const { setDiscount } = useAmountStore();
  const {
    formState: { errors },
    getValues,
  } = methods;

  const getPromoCode = async (code: string) => {
    try {
      const res = await promocodeAPI.getDiscount(code);
      setDiscount(res);
    } catch (err) {
      const error = err as AxiosError;
      const { message } = error.response?.data as ErrorResponse;

      setDiscount(0);
      toast('', {
        position: 'top-center',
        description: (
          <div className='flex items-center gap-[6px]'>
            <WarningIcon fill='#010D04' className='rotate-180' />
            {message}
          </div>
        ),
      });
    }
  };

  return (
    <>
      <div className='space-y-6'>
        {!isHidePromocode && (
          <FormField
            control={methods.control}
            name={'promocode' as Path<T>}
            render={({ field }) => (
              <FormItem>
                <Label className='mt-6 block text-xs font-normal'>
                  Promo Code
                </Label>
                <FormControl>
                  <div className='relative'>
                    <Input
                      {...field}
                      className='mt-2 h-[48px] border-[#8D9395] bg-white lg:h-12'
                      placeholder='Promo Code'
                    />
                    <Button
                      type='button'
                      onClick={() =>
                        getPromoCode(getValues('promocode' as Path<T>))
                      }
                      variant='link'
                      className='absolute right-[11px] top-[50%] h-fit w-fit translate-y-[-50%] p-0'
                    >
                      Apply
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <h3 className='h3'>Payment info</h3>

        <FormField
          control={methods.control}
          name={'cardHolderName' as Path<T>}
          render={({ field }) => (
            <FormItem>
              <Label className='mt-6 block text-xs font-normal'>
                Cardholder name
              </Label>
              <FormControl>
                <Input
                  {...field}
                  className={`mt-2 h-[48px] border-[#8D9395] bg-white lg:h-12 ${errors.cardHolderName && 'focus:ring-danger-outline'}`}
                  placeholder='Full name on card'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PaymentElement
          id='payment'
          onChange={(e) => {
            onPaymentElementChange?.(e.complete);
          }}
        />
      </div>
      <Toaster />
    </>
  );
}

export default CheckoutFields;
