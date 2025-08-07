'use client';

import { usePathname } from 'next/navigation';
import React, { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './ui/breadcrumb';

function DynamicBreadcrumb() {
  const pathArray = usePathname()
    .split('/')
    .filter((p) => p)
    .slice(0, 2);

  const replaceDash = (path: string): string => {
    return path.split('-').join(' ');
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathArray.map((path, i) => (
          <Fragment key={path}>
            {path === pathArray.at(-1) ? (
              <BreadcrumbItem>
                <BreadcrumbPage className='capitalize'>
                  {replaceDash(path)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className='capitalize'
                    href={
                      pathArray[0] === 'will'
                        ? '/'
                        : `/${pathArray.slice(0, i + 1).join('/')}`
                    }
                  >
                    {replaceDash(path)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default DynamicBreadcrumb;
