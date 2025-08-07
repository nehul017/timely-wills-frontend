import dynamic from 'next/dynamic';

const SignupComponent = dynamic(() => import('../SignupComponent'), {
  ssr: false,
});

export default function NewPasswordPage() {
  return <SignupComponent />;
}
