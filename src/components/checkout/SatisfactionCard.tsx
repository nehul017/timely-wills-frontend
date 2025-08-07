import React from 'react';

import SatisfactionIcon from '@/assets/icons/satisfaction-icon';

function SatisfactionCard() {
  return (
    <div className='#DEE0DF] mt-6 flex flex-col gap-5 rounded-lg border bg-[#F7F7F7] p-5 lg:flex-row'>
      <SatisfactionIcon className='shrink-0' />
      <div>
        <h3 className='mb-2 text-[16px] font-semibold'>
          30-day satisfaction guarantee
        </h3>
        <p className='text-sm text-[#010D0499]'>
          We’re confident in the quality of our products and services. If you’re
          not fully satisfied with your purchase, reach out to us within 30 days
          to request a refund.
        </p>
      </div>
    </div>
  );
}

export default SatisfactionCard;
