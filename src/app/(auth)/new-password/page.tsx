import dynamic from 'next/dynamic';

const NewPasswordComponent = dynamic(() => import('../NewPasswordComponent'), {
  ssr: false,
});

export default function NewPasswordPage() {
  return <NewPasswordComponent />;
}
