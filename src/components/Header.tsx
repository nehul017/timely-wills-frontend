'use client';

import { useCallback, useState } from 'react';

import { removeScrollForBody } from '@/utils';

import Aside from './Aside';
import Navbar from './Navbar';

function Header() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const toggelMenuIcon = useCallback(() => {
    setIsOpenMenu((prev) => !prev);
    removeScrollForBody();
  }, []);

  return (
    <header className='bg-[#c8f4e452]'>
      <Navbar isOpenMenu={isOpenMenu} toggelMenuIcon={toggelMenuIcon} />
      <Aside toggelMenuIcon={toggelMenuIcon} isOpenMenu={isOpenMenu} />
    </header>
  );
}

export default Header;
