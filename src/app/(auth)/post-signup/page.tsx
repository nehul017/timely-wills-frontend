import Link from 'next/link';

import DocumentIcon from '@/assets/icons/document';
import GavelIcon from '@/assets/icons/gavel';
import PencilIcon from '@/assets/icons/pencil';
import SuccessIcon from '@/assets/icons/success';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  searchParams: { query: string };
};

export default function PostSignupPage({ searchParams }: Props) {
  const { query } = searchParams;

  return (
    <main className='flex flex-col items-center justify-center'>
      <Card className='h-[579px] max-w-[663px] border-black'>
        <CardHeader className='pb-[55px] pt-[20px] text-center'>
          <CardTitle className='text-2xl font-bold lg:text-[35px]'>
            What happens Next?
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <ul className='space-y-[27px] px-6 lg:px-[82px]'>
            <li className='flex items-center space-x-3'>
              <SuccessIcon />
              <span className='text-[16px] font-normal lg:text-[20px]'>
                Account creation
              </span>
            </li>
            <li className='flex items-center space-x-[18px]'>
              <PencilIcon />
              <div className='flex w-full items-center'>
                <span className='text-[16px] font-normal lg:text-[20px]'>
                  Fill out the will questionnaire
                </span>
                <div className='ml-[73px]'>
                  <Badge
                    variant='upNext'
                    className='whitespace-nowrap border-none px-[8px] py-[3px] text-[13px] font-normal'
                    style={{ backgroundColor: '#DBFFE5', color: '#000' }}
                  >
                    Up Next
                  </Badge>
                </div>
              </div>
            </li>
            <li className='flex items-center space-x-[18px]'>
              <DocumentIcon />
              <span className='text-[16px] font-normal lg:text-[20px]'>
                Purchase &amp; submit your will for review
              </span>
            </li>
            <li className='flex items-center space-x-3'>
              <GavelIcon />
              <span className='text-[16px] font-normal lg:text-[20px]'>
                Sign &amp; notarize your documents
              </span>
            </li>
          </ul>
          <div className='mt-[60px] px-6'>
            <Link
              href='/Power-of-attorney/About-You'
              className='mx-auto flex h-[46px] w-full items-center justify-center rounded-lg bg-bright text-[16px] font-bold text-white lg:w-[455px]'
            >
              Start My Will
            </Link>
          </div>
          <div className='mt-[15px] text-center'>
            <Link href={query ? '/Power-of-attorney' : '/'}>
              <span className='text-[16px] font-normal text-[#000]'>
                I&apos;ll create it later
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
