import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className='mb-[50px] flex w-[490px] flex-col items-center'>
      <div className='mb-[10px] flex w-full justify-between'>
        <span className='text-[20px] font-normal'>Your Progress</span>
        <span className='text-[20px] font-normal'>{value}%</span>
      </div>
      <Progress
        value={value}
        className='h-[15px] bg-[#D5D5D5]'
        indicatorClassName='rounded-r-full bg-[#25D998]'
      />
    </div>
  );
}
