import axios from 'axios';
import React from 'react';

type Props = {
  searchParams: { code: string };
};

async function ConfirmDeletePage({ searchParams: { code } }: Props) {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm-deleting`,
      { code },
    );
  } catch (error) {
    console.log(error);
  }

  return (
    <section className='mx-auto max-w-[700px] text-center text-3xl font-bold leading-[50px] lg:text-[35px]'>
      <h1 className='mb-8'>Confirmed!</h1>
      <p>You have confirmed deletion of your account</p>
    </section>
  );
}

export default ConfirmDeletePage;
