'use client';

import withAuth from '@/components/withAuth';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/store/user-info';
import Link from 'next/link';
import Footer from '@/components/Footer';

type PaymentProduct = {
  isWill: string;
  isWillCouple: string;
  isSub: string;
};

type Payment = {
  id: number;
  paidAt: string;
  status: string;
  products: PaymentProduct;
  amount?: string;
};
function PaymentsPage() {
  const { userInfo } = useAuthStore();

  const formatDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString() : 'N/A';

  const latestPayment = userInfo?.payments
  ?.filter((p: any) => p.status === 'paid')
  .sort((a: any, b: any) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())[0] as Payment | undefined;

  return (
    <div>
      <main className="max-w-3xl mx-auto p-6 min-h-[70vh] flex flex-col gap-8">
        <Toaster />
        <h1 className="text-3xl font-bold">Payments</h1>

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Latest Payment Information</h2>
          {latestPayment ? (
            <div>
              <p className="font-medium mb-1">
                {[
                  latestPayment?.products?.isWill == 'true' && 'Will',
                  latestPayment.products.isWillCouple == 'true' && 'Couple Will',
                  latestPayment.products.isSub == 'true' && 'Subscription',
                ]
                  .filter(Boolean)
                  .join(' + ')}
              </p>
              <p className="text-sm text-gray-600">
                Paid on: {formatDate(latestPayment.paidAt)} | Status: {latestPayment.status}
                {/* Add amount here only if it exists */}
                {latestPayment.amount && ` | Amount: $${latestPayment.amount}`}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">You haven't added any billing information yet.</p>
              <Link
                className='font-bold text-bright underline'
                href='will/checkout'
              >
                Click here to go to checkout
              </Link>
            </div>
          )}
        </section>

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
          {userInfo?.payments?.length ? (
            <ul className="divide-y divide-gray-200">
              {userInfo.payments.map((payment: any) => {
                const products = [
                  payment.products.isWill == 'true' ? 'Will' : null,
                  payment.products.isWillCouple == 'true' ? 'Couple Will' : null,
                  payment.products.isSub == 'true' ? 'Subscription' : null,
                ].filter(Boolean);

                return (
                  <li key={payment.id} className="py-3">
                    <p className="font-medium">{products.join(' + ')}</p>
                    <p className="text-sm text-gray-600">
                      Paid on: {formatDate(payment.paidAt)} | Status: {payment.status}
                      {payment.amount && ` | Amount: $${payment.amount}`} 
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-600">No purchase history available.</p>
          )}
        </section>
      </main>
      <div className='container max-w-[1200px] px-6 xl:p-0'>
        <Footer />
      </div>
    </div>
  );
}

export default withAuth(PaymentsPage);
