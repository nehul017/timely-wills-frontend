import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback } from 'react';

import AccountIcon from '@/assets/icons/account-icon';
import ChevronIcon from '@/assets/icons/chevron-down';
import LogoutIcon from '@/assets/icons/logout';
import useResetAllGlobalData from '@/hooks/use-reset-all-global-data';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/user-info';
import { clearSession } from '@/utils/session';

import { links } from './Navbar';

type Props = {
  toggelMenuIcon: () => void;
  isOpenMenu: boolean;
};

function Aside({ toggelMenuIcon, isOpenMenu }: Props) {
  const { removeUserInfo, userInfo } = useAuthStore();
  const { resetAllGlobalData } = useResetAllGlobalData();
  const pathname = usePathname();

  const handleLogout = () => {
    removeUserInfo();
    resetAllGlobalData();
    clearSession();
    localStorage.removeItem('progress-step-storage');
    window.location.replace('/login');
  };

  const renderLink = useCallback(
    (link: { text: string; href: string }, i: number) => {
      const isActive =
        pathname.includes(link.href.slice(1)) || (pathname === '/' && !i);

      return (
        <li key={link.text} className='flex h-14 items-center'>
          <Link
            onClick={toggelMenuIcon}
            href={`${link.href === '/will' ? '/' : link.href}`}
            className={`flex w-full items-center justify-between text-[16px] font-medium ${isActive ? 'text-[#25D998]' : 'text-[#010D04]'} hover:text-[#25D998]`}
          >
            {link.text}{' '}
            <ChevronIcon className='rotate-[-90deg]' fill='#010D04' />
          </Link>
        </li>
      );
    },
    [pathname],
  );

  return (
    <aside
      className={`fixed left-0 right-0 top-[62px] z-20 h-screen bg-[#FDF8ED] px-[30px] transition-transform duration-300 ${isOpenMenu ? 'translate-x-0' : 'translate-x-[-100%]'}`}
    >
      <ul>
        {pathname !== '/about' && links.map((link, i) => renderLink(link, i))}

        <li className='flex h-14 items-center'>
          <Link
            onClick={toggelMenuIcon}
            href='/account-settings'
            className={cn(
              'flex w-full items-center justify-between text-[16px] font-medium hover:text-[#25D998]',
              pathname === '/account-settings' ? 'text-bright' : undefined,
            )}
          >
            <span className='flex items-center gap-2'>
              <AccountIcon
                fill={pathname === '/account-settings' ? '#25D998' : '#010D04'}
              />
              My Account
            </span>
            <ChevronIcon className='rotate-[-90deg]' fill='#010D04' />
          </Link>
        </li>

        {!userInfo ? (
          <li className='flex h-14 items-center'>
            <Link
              href='/login'
              className='flex w-full items-center justify-between text-[16px] font-medium'
            >
              <span className='flex items-center gap-2'>Login</span>
              <ChevronIcon className='rotate-[-90deg]' fill='#010D04' />
            </Link>
          </li>
        ) : (
          <li className='flex h-14 items-center'>
            <Link
              href='/'
              onClick={() => {
                handleLogout();
                toggelMenuIcon();
              }}
              className='flex w-full items-center justify-between text-[16px] font-medium hover:text-[#25D998]'
            >
              <span className='flex items-center gap-2'>
                <LogoutIcon /> Log out
              </span>
              <ChevronIcon className='rotate-[-90deg]' fill='#010D04' />
            </Link>
          </li>
        )}
      </ul>
    </aside>
  );
}

export default Aside;
