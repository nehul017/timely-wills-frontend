import dynamic from 'next/dynamic';

const LoginComponent = dynamic(() => import('../LoginComponent'), {
  ssr: false,
});

export default function NewPasswordPage() {
  return <LoginComponent />;
}
