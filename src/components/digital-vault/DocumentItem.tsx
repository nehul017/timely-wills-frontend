import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction } from 'react';

import BagIcon from '@/assets/icons/bag-icon';
import DeleteIcon from '@/assets/icons/delete-icon';
import DocumentIcon from '@/assets/icons/document-icon';
import DotsIcon from '@/assets/icons/dots-icon';
import EditIcon from '@/assets/icons/edit';
import EyeIcon from '@/assets/icons/eye-icon';
import RenameIcon from '@/assets/icons/rename-icon';
import { useDigitalStore } from '@/store/digital/index';
import { FileWithTitle, GeneratedFile } from '@/store/digital/types';
import { useHealthCareStore } from '@/store/health-care';
import { useAuthStore } from '@/store/user-info';

import DownloadButton from '../DownloadButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type Props = {
  document: FileWithTitle | GeneratedFile;
  openDialogRename: () => void;
  openDialogDelete: () => void;
  openDialogView: () => void;
  setDoc: Dispatch<SetStateAction<string>>;
  ducumentType?: 'estate' | 'personal';
};

function DocumentItem({
  openDialogRename,
  openDialogDelete,
  setDoc,
  openDialogView,
  document,
  ducumentType = 'estate',
}: Props) {
  const { setSelectedDocument, setDocumentUrl } = useDigitalStore();
  const { userInfo } = useAuthStore();
  const { id: healthCareId } = useHealthCareStore();
  const router = useRouter();
  const isBoughtWill = userInfo?.products?.some(
    (item) => item.product_type === 'WILL',
  );
  const shouldDownloadWill = !isBoughtWill && document.title === 'Last Will';

  const handleRedirect = (title: string) => {
    let path = '';

    switch (title) {
      case 'Last Will':
        path = '/will';
        break;

      case 'Living Will':
        path = '/Power-of-attorney/Health-Care-Directives/Living-Will';
        break;

      case 'Durable POA':
        path = '/Power-of-attorney/Durable-POA';
        break;

      case 'Medical POA':
        path = healthCareId
          ? '/Power-of-attorney/Health-Care-Directives/Medical-POA-and-Living-Will'
          : '/Power-of-attorney/Health-Care-Directives/Medical-POA';
        break;

      default:
        path =
          '/Power-of-attorney/Health-Care-Directives/Medical-POA-and-Living-Will';
    }

    router.push(path);
  };

  return (
    <li className='grid min-h-[92px] grid-cols-[1fr_98px] justify-between gap-x-5 border-b border-b-[#DEE0DF] p-6 lg:flex lg:min-h-[82px]'>
      <div className='flex flex-col text-[16px] font-semibold lg:flex-row lg:items-center lg:gap-[14px] lg:text-xl'>
        <div>
          <DocumentIcon
            className='hidden h-7 w-[22px] lg:inline-flex'
            fill='#DEE0DFCC'
          />
        </div>

        <div
          className={
            document.isSignedCopy ? 'block items-center lg:flex' : undefined
          }
        >
          <span className='mr-3 text-[10px] font-medium lg:hidden'>
            {dayjs(document.createdAt).format('MMM. DD, YYYY')}
          </span>

          <h2 className='capitalize'>{document.title}</h2>

          {document.notes && ducumentType === 'personal' && (
            <p className='hidden text-xs font-normal text-[#636B65] lg:inline-flex lg:text-sm'>
              {document.notes}
            </p>
          )}

          {document.isSignedCopy && (
            <div className='lg:border-gradient'>
              <span className='block rounded-[6px] bg-transparent px-0 py-[6px] text-xs font-normal text-[#25D998] lg:bg-[#25D998] lg:px-3 lg:text-sm lg:font-semibold lg:text-white'>
                Signed copy
              </span>
            </div>
          )}
        </div>
      </div>

      <div className='flex h-11 items-center gap-[6px] lg:gap-3'>
        <span className='mr-3 hidden whitespace-nowrap text-sm font-medium lg:inline-flex'>
          {dayjs(document.createdAt).format('MMM. DD, YYYY')}
        </span>

        {shouldDownloadWill ? (
          <Link
            className='flex h-[42px] w-[98px] items-center justify-center rounded-[8px] border border-[#DEE0DF] bg-white text-sm font-semibold text-inherit hover:bg-[#F7F7F7] lg:h-11 lg:w-[284px]'
            href='/will/checkout'
          >
            <BagIcon className='mr-1' />
            <span className='hidden lg:inline-flex'>Go to checkout</span>
          </Link>
        ) : (
          <>
            <DownloadButton fileUrl={document.file?.url || ''} />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className='flex h-[42px] w-[46px] items-center justify-center rounded-[8px] border border-[#DEE0DF] bg-white text-sm font-semibold text-inherit hover:bg-[#F7F7F7] lg:h-11 lg:w-[136px]'>
                  <DotsIcon className='mr-0 lg:mr-1' />
                  <span className='hidden lg:inline-flex'>Options</span>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align='end'
                className='w-[140px] p-0 lg:w-[186px]'
              >
                {!document.type && (
                  <DropdownMenuItem
                    onClick={() => handleRedirect(document.title)}
                    className='h-12 cursor-pointer text-sm lg:text-[16px]'
                  >
                    <EditIcon className='mr-1' />
                    Edit
                  </DropdownMenuItem>
                )}

                {document.type && (
                  <DropdownMenuItem
                    onClick={() => {
                      openDialogRename();
                      setSelectedDocument(document);
                    }}
                    className='h-12 cursor-pointer text-sm lg:text-[16px]'
                  >
                    <RenameIcon className='mr-1' />
                    Edit
                  </DropdownMenuItem>
                )}

                {(ducumentType === 'personal' || document.isSignedCopy) && (
                  <DropdownMenuItem
                    onClick={() => {
                      setDocumentUrl(document.file.url);
                      setSelectedDocument(document);
                      openDialogView();
                    }}
                    className='h-12 cursor-pointer text-sm lg:text-[16px]'
                  >
                    <EyeIcon className='mr-1' />
                    View
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => {
                    openDialogDelete();
                    setDoc(document.title);
                    setSelectedDocument(document);
                  }}
                  className='custom-delete-item h-12 cursor-pointer text-sm lg:text-[16px]'
                >
                  <DeleteIcon className='mr-1' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {document.notes && (
        <p className='col-span-2 mt-[6px] text-xs font-normal text-[#636B65] lg:hidden lg:text-sm'>
          {document.notes}
        </p>
      )}
    </li>
  );
}

export default DocumentItem;
