'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import '../globals.css';

import WarningIcon from '@/assets/icons/warning-icon';
import CheckoutFields from '@/components/checkout/CheckoutFields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import useStripeCheckout from '@/hooks/checkout/use-stripe-checkout';
import { poaCheckoutSchema } from '@/schemas/checkout';
import paymentApi from '@/services/payment';
import { useAuthStore } from '@/store/user-info';

type FormData = z.infer<typeof poaCheckoutSchema>;

function RenewCheckout() {
  const {
    elements,
    errorMessage,
    isSubmitedForm,
    setErrorMessage,
    setIsSubmitedForm,
    stripe,
    customError,
  } = useStripeCheckout();
  const { userInfo } = useAuthStore();
  const router = useRouter();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(poaCheckoutSchema),
    defaultValues: {
      cardHolderName: '',
    },
    mode: 'onChange',
  });

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

    const { cardHolderName } = data;

    try {
      clientSecret = await paymentApi.post({
        isSub: true,
        isWill: false,
        isWillCouple: false,
      });
    } catch (error) {
      toast('', {
        position: 'top-center',
        description: (
          <div className='flex items-center gap-[6px] font-bold text-danger'>
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
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL?.replace('back/api', '')}`,
        },
      });

      if (error) {
        setErrorMessage(customError);
        setIsSubmitedForm(false);
        return;
      }
    }

    router.push('/');
    setIsSubmitedForm(false);
    setErrorMessage('');
  };

  return (
    <Form {...methods}>
      <form
        className='mt-8 lg:mt-12'
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
        <CheckoutFields 
          isHidePromocode 
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
      </form>
    </Form>
  );
}

export default RenewCheckout;
