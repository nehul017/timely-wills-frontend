'use client';

import CheckoutSection from '@/components/checkout/CheckoutSection';
import withAuth from '@/components/withAuth';

function PoaCheckoutPage() {
  return <CheckoutSection />;
}

export default withAuth(PoaCheckoutPage);
