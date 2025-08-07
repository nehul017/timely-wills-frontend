'use client';

import { CreditCard, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';

import BurgerIcon from '@/assets/icons/burger-icon';
import ChevronDownIcon from '@/assets/icons/chevron-down';
import CloseIcon from '@/assets/icons/close-icon';
import LogoIcon from '@/assets/icons/logo';
import LogoutIcon from '@/assets/icons/logout';
import ProfileIcon from '@/assets/icons/profile';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useResetAllGlobalData from '@/hooks/use-reset-all-global-data';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/user-info';
import { clearSession } from '@/utils/session';

import InfoPopup from './InfoPopup';

export const links = [
  { text: 'Will', href: '/will' },
  { text: 'Power of attorney', href: '/Power-of-attorney' },
  { text: 'Digital Vault', href: '/digital-vault' },
  // { text: 'Profile', href: '/account-profile' },
];

type Props = {
  toggelMenuIcon: () => void;
  isOpenMenu: boolean;
};

export default function Navbar({ isOpenMenu, toggelMenuIcon }: Props) {
  const { userInfo, removeUserInfo } = useAuthStore();
  const { resetAllGlobalData } = useResetAllGlobalData();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    removeUserInfo();
    resetAllGlobalData();
    clearSession();
    localStorage.removeItem('progress-step-storage');
    window.location.replace('/login');
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };

  const renderLink = useCallback(
    (link: { text: string; href: string }, i: number) => {
      const isActive =
        pathname.includes(link.href.slice(1)) || (pathname === '/' && !i);

      return (
        <li key={link.text}>
          <Link
            href={`${link.href === '/will' ? '/' : link.href}`}
            className={`text-lg font-medium ${isActive ? 'text-[#25D998]' : 'text-[#010D04]'} hover:text-[#25D998]`}
          >
            {link.text}
          </Link>
        </li>
      );
    },
    [pathname],
  );

  const accountMenu = useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='ml-8 gap-2.5'>
          <Button
            variant='link'
            className={cn(
              'items-center text-lg font-medium text-[#010D04] hover:text-bright hover:no-underline',
              pathname === '/account-settings' ? 'text-bright' : undefined,
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            My Account
            <span className='pt-[1px]'>
              <ChevronDownIcon
                fill={pathname === '/account-settings' ? '#25D998' : '#010D04'}
              />
            </span>
          </Button>
        </DropdownMenuTrigger>

        {isOpen && (
          <DropdownMenuContent className='p-2'>
            <DropdownMenuItem>
              <Link
                href='/account-settings'
                className='grid grid-cols-[23px_auto] items-center gap-3'
                onClick={handleMenuClose}
              >
                <Settings className='justify-self-end' />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/account-profile'
                className='grid grid-cols-[23px_auto] items-center gap-3'
                onClick={handleMenuClose}
              >
                <ProfileIcon className='justify-self-end' />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/account-payment'
                className='grid grid-cols-[23px_auto] items-center gap-3'
                onClick={handleMenuClose}
              >
                <CreditCard size={24} color='black' />
                <span>Payment</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/'
                onClick={() => {
                  handleLogout();
                  handleMenuClose();
                }}
                className='grid grid-cols-[23px_auto] items-center gap-3'
              >
                <LogoutIcon />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    ),
    [isOpen, pathname],
  );

  return (
    <nav className='flex h-[62px] w-full items-center justify-center lg:h-[86px]'>
      <div className='container flex max-w-[1200px] items-center justify-between px-6 xl:p-0'>
        <Link href='/'>
          <span className='block'>
            <LogoIcon className='h-[30px] w-[111px] lg:h-[54px] lg:w-[198px]' />
          </span>
        </Link>

        <div className='hidden items-center lg:flex'>
          {pathname !== '/about' && (
            <ul className='flex gap-[32px]'>
              {links.map((link, i) => renderLink(link, i))}
            </ul>
          )}
          {userInfo && accountMenu}
        </div>

        <div className='flex items-center space-x-3 lg:hidden'>
          <InfoPopup isShownMobile />

          <div
            aria-hidden='true'
            onClick={toggelMenuIcon}
            className='cursor-pointer'
          >
            {isOpenMenu ? <CloseIcon /> : <BurgerIcon />}
          </div>
        </div>
      </div>
    </nav>
  );
}
