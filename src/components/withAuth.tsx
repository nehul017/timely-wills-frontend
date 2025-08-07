'use clinet';

import { useRouter } from 'next/navigation';
import { useEffect, useState, ComponentType } from 'react';

import { useAuthStore } from '@/store/user-info';

import Spinner from './ui/spinner';

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
): ComponentType<P> => {
  function ComponentWithAuth(props: P) {
    const { userInfo } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!userInfo) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    }, [userInfo, router]);

    if (isLoading) {
      return (
        <div className='flex items-center justify-center'>
          <Spinner />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  }

  return ComponentWithAuth;
};

export default withAuth;
