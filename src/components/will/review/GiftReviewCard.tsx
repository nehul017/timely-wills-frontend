import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import { useProgressStepStore } from '@/store/progress-steps';
import { BeneficiaryForGift } from '@/store/will/gifts/types';

type Props = {
  beneficiaryForGift: BeneficiaryForGift;
};

function GiftReviewCard({ beneficiaryForGift }: Props) {
  const { setWillMainStep, setSubStep } = useProgressStepStore();
  const handleClick = () => {
    setWillMainStep(2);
    setSubStep(2);
  };

  const { fullName, message, money, giftDescription } = beneficiaryForGift;

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

      <p className='mb-[16px] flex flex-col space-y-1 text-sm'>
        Gift:
        <span className='text-[16px] font-semibold'>
          {giftDescription || `$${money}`}
        </span>
      </p>

      <p className='flex flex-col space-y-1 text-sm'>
        Message:
        <span className='text-[16px] font-semibold'>{message}</span>
      </p>
    </div>
  );
}

export default GiftReviewCard;
