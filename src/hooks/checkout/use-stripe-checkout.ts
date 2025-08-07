import {
  useElements,
  useStripe,
  CardElement,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useEffect, useRef, useState } from 'react';

const useStripeCheckout = () => {
  const elements = useElements();
  const stripe = useStripe();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [isSubmitedForm, setIsSubmitedForm] = useState(false);
  const divRefCard = useRef<HTMLDivElement>(null);
  const divRefCVC = useRef<HTMLDivElement>(null);
  const divRefExpire = useRef<HTMLDivElement>(null);
  const customError =
    'Error: payment information invalid or unavailable, please try again later.';

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleFocus =
    (element: HTMLDivElement | null, borderRadius: string) => () => {
      if (element) {
        element.style.boxShadow = `0 0 0 2px #25d9987f`;
        element.style.borderRadius = borderRadius;
      }
    };

  const handleBlur = (element: HTMLDivElement | null) => () => {
    if (element) {
      element.style.borderColor = '#8D9395';
      element.style.boxShadow = 'none';
    }
  };

  return {
    elements,
    stripe,
    errorMessage,
    loading,
    isSubmitedForm,
    CardElement,
    divRefCard,
    divRefCVC,
    divRefExpire,
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    PaymentElement,
    handleBlur,
    handleFocus,
    setIsSubmitedForm,
    setErrorMessage,
    customError,
  };
};

export default useStripeCheckout;
