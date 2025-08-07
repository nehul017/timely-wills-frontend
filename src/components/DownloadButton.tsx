import DownloadIcon from '@/assets/icons/download-icon';
import { cn } from '@/lib/utils';

import { Button } from './ui/button';

type Props = {
  isShownText?: boolean;
  fileUrl: string;
  className?: string;
};

export default function DownloadButton({
  fileUrl,
  className,
  isShownText,
}: Props) {
  const downloadFile = async () => {
    const response = await fetch(
      `/api/proxy?url=${encodeURIComponent(fileUrl)}`,
    );
    if (!response.ok) {
      console.error('Failed to download file');
      return;
    }
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileUrl.split('/').pop() || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={downloadFile}
      className={cn(
        'h-[42px] w-[46px] border border-[#DEE0DF] bg-white p-0 font-semibold text-inherit hover:bg-[#F7F7F7] lg:h-11 lg:w-[136px]',
        className,
      )}
    >
      <DownloadIcon
        fill={isShownText ? 'white' : undefined}
        className='mr-0 lg:mr-1'
      />
      <span className={`${!isShownText ? 'hidden' : undefined} lg:inline`}>
        Download
      </span>
    </Button>
  );
}
