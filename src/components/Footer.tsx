'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

import LogoIcon from '@/assets/icons/logo';

import { Separator } from './ui/separator';

function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();

  const publicSiteURL = process.env.NEXT_PUBLIC_TIMELY_WEBSITE_URL;
  const termsUrlPart = '/terms-of-service';
  const privacyUrlPart = '/privacy-policy';
  const returnUrlPart = '/return-policy';
  const contactUrlPart = '/contact-us';
  const resourcesUrlPart = '/resources';
  const faqUrlPart = '/faq';
  const termsURL = publicSiteURL + termsUrlPart;
  const privacyURL = publicSiteURL + privacyUrlPart;
  const returnURL = publicSiteURL + returnUrlPart;
  const contactURL = publicSiteURL + contactUrlPart;
  const resourcesURL = publicSiteURL + resourcesUrlPart;
  const faqURL = publicSiteURL + faqUrlPart;

  const helpLinks = [
    { text: 'Contact Us', href: contactURL, target: '_blank', rel: '' },
    { text: 'FAQ', href: faqURL, target: '_blank', rel: '' },
    { text: 'Resources', href: resourcesURL, target: '_blank', rel: '' },
  ];
  const policyLinks = [
    { text: 'Terms & Conditions', href: termsURL, target: '_blank', rel: '' },
    { text: 'Privacy Policy', href: privacyURL, target: '_blank', rel: '' },
    { text: 'Return Policy', href: returnURL, target: '_blank', rel: '' },
  ];

  const renderLink = useCallback(
    (link: { text: string; href: string; target: string; rel: string }, i: number) => {
      return (
        <li key={link.text}>
          <Link
            href={`${link.href}`}
            rel={`${link.rel === '' ? 'noreferrer' : link.rel}`}
            target={`${link.target === '' ? '_blank' : link.target}`}
            className={`text-sm font-medium  text-[#010D04] hover:text-[#25D998]`}
          >
            {link.text}
          </Link>
        </li>
      );
    },
    [pathname],
  );

  return (
    <footer className='mb-[62px] mt-[30px] text-[#010D04] lg:mb-16 lg:mt-[94px]'>

      <div className='container flex max-w-[1200px] items-center justify-between px-6 xl:p-0'>
        <Link href='/'>
          <span className='block'>
            <LogoIcon className='h-[20px] w-[111px] lg:h-[54px] lg:w-[198px]' />
          </span>
        </Link>

        <div className='hidden items-center lg:flex'>
          <ul className='flex gap-[32px]'>
            <li>
              <h2>Help:</h2>
            </li>
            {helpLinks.map((link, i) => renderLink(link, i))}
          </ul>
        </div>
        <div className='hidden items-center lg:flex'>
          <ul className='flex gap-[32px]'>
            <li>
              <h2>Policies:</h2>
            </li>
            {policyLinks.map((link, i) => renderLink(link, i))}
          </ul>
        </div>
      </div>

      <Separator className='h-[1.5px] bg-[#010D041A]' />

      <div className='mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <ul className='flex gap-[26px] text-sm'>
            <li>{`© ${year} Timely.   All Rights Reserved`}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
