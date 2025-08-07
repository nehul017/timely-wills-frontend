'use client';

import CheckoutSection from '@/components/checkout/CheckoutSection';
import withAuth from '@/components/withAuth';

function WillCheckoutPage() {
  return <CheckoutSection />;
}

export default withAuth(WillCheckoutPage);
