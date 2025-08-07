import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import { useProgressStepStore } from '@/store/progress-steps';

type Props = {
  fullName: string;
  type: 'Primary Executor' | 'Backup Executor';
  subStep: number;
};

function ExecutorReview({ fullName, type, subStep }: Props) {
  const { setWillMainStep, setSubStep } = useProgressStepStore();
  const handleClick = () => {
    setWillMainStep(3);
    setSubStep(subStep);
  };

  return (
    <div>
      <h3 className='mb-[16px] flex items-center justify-between text-lg font-semibold'>
        {fullName}
        <Button
          onClick={handleClick}
          variant='ghost'
          className='h-fit w-fit p-0'
        >
          <PencillFillIcon />
        </Button>
      </h3>

      <p className='mb-[16px] flex flex-col space-y-1 text-sm'>{type}</p>
    </div>
  );
}

export default ExecutorReview;
