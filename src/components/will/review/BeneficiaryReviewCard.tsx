import PencillFillIcon from '@/assets/icons/pencil-fill';
import { Button } from '@/components/ui/button';
import { useProgressStepStore } from '@/store/progress-steps';
import { Beneficiary } from '@/store/will/estate/types';

type Props = {
  beneficiary: Beneficiary;
};

function BeneficiaryReviewCard({ beneficiary }: Props) {
  const { setWillMainStep, setSubStep } = useProgressStepStore();
  const handleClick = () => {
    setWillMainStep(1);
    setSubStep(0);
  };

  const { backupType, fullName, percent, backupBeneficiaries } = beneficiary;

  const getBackup = () => {
    switch (backupType) {
      case 'children':
        return 'Go directly to their children';

      case 'splitWithOtherBeneficiaries':
        return 'Divide among my surviving beneficiaries';

      default:
        return backupBeneficiaries.map(({ fullName }) => fullName).join(', ');
    }
  };

  return (
    <div>
      <h3 className='mb-[18px] flex items-center justify-between text-lg font-semibold'>
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
        Share:
        <span className='text-[16px] font-semibold'>{`${percent}%`}</span>
      </p>

      <p className='flex flex-col space-y-1 text-sm'>
        Backup:
        <span className='text-[16px] font-semibold'>{getBackup()}</span>
      </p>
    </div>
  );
}

export default BeneficiaryReviewCard;
