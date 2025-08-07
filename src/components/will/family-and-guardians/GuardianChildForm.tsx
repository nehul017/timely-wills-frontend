'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { singleGuardianSchema } from '@/schemas/will/family';
import willAPI from '@/services/will';
import { FamilyMember, WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';
import { Child } from '@/store/will/family-and-guardians/types';
import { shouldCallAPI } from '@/utils';

import GuardianFields from './GuardianFields';
import FormWrapper from '../../FormWrapper';
import InfoPopup from '../../InfoPopup';
import QuestionDialig from '../../QuestionDialog';

type FormData = z.infer<typeof singleGuardianSchema>;

function GuardianChildForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { increaseSubStep, decreaseSubStep } = useProgressStepStore();
  const { children, pets, updateChildren } = useFamilyMembersState();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();

  const guardian = children[0]?.guardian;
  const defaultData = {
    fullName: guardian?.fullName || '',
    email: guardian?.email || '',
    isOver18: !!guardian?.fullName,
    personType: guardian?.personType || '',
    phoneNumber: guardian?.phoneNumber || '',
    address: guardian?.address || '',
  };
  const methods = useForm<FormData>({
    resolver: zodResolver(singleGuardianSchema),
    defaultValues: { ...defaultData },
  });

  const { trigger, getValues } = methods;

  const submitData = async (data: FormData, isNotRedirect?: boolean) => {
    const res = await willAPI.getWill();
    const { isOver18, ...guardian } = data;
    const preparedKids: FamilyMember[] = children.map((child) => ({
      ...child,
      guardian: [{ ...guardian, email: guardian.email || null }],
      type: 'child',
      petType: null,
    }));

    const preparedPets: FamilyMember[] = pets.map((pet, i) => ({
      ...pet,
      guardian: pets[i]?.guardian ? [pets[i].guardian] : [],
      birthday: null,
    }));

    const bodyForRequest: WillRequestBody = {
      ...willRequestBody,
      family: [...preparedKids, ...preparedPets],
      isChildren: !!children.length,
    };

    try {
      if (res) {
        await willAPI.updateWill(res.id, bodyForRequest);
      } else {
        await willAPI.createWill(bodyForRequest);
      }

      if (!isNotRedirect) {
        router.push('/');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleNext = async () => {
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    const { isOver18, ...guardian } = getValues();
    const kidsWithGuardian: Child[] = children.map((kid) => ({
      ...kid,
      guardian: { ...guardian, email: guardian.email || null },
    }));

    if (
      !shouldCallAPI(getValues(), defaultData) ||
      children.some((child) => !child.guardian?.fullName)
    ) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        updateChildren(kidsWithGuardian);
        increaseSubStep();
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      increaseSubStep();
    }
  };

  const handleBack = () => {
    decreaseSubStep();
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await submitData(data);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <h2 className='h3 mb-6'>
          Choose a guardian for your{' '}
          <span className='relative'>
            children
            <QuestionDialig question='Choose a guardian for your children'>
              <span className='mb-2 block text-lg font-semibold text-[#010D04] lg:text-[20px]'>
                What is a guardian?
              </span>
              <span className='mb-6 block'>
                Nominating guardians in your Will is a crucial step in
                designating who should care for your dependent children if both
                parents pass away. By clearly stating your guardianship
                preferences, you can prevent the court from making this
                important decision on your behalf.
              </span>

              <span className='mb-2 block text-lg font-semibold text-[#010D04] lg:text-[20px]'>
                Who should I appoint as a guardian?
              </span>
              <span>
                Choosing the right guardian for your children is a decision that
                requires some thinking. There are numerous factors to take into
                account, such as the guardian’s age, location, lifestyle and
                values, financial situation, religion, and whether they already
                have a family.
              </span>
            </QuestionDialig>
          </span>
        </h2>

        <InfoPopup />
      </div>

      <div className='w-full lg:max-w-[690px]'>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormWrapper
              isNextLoading={isNextLoading}
              handleBack={handleBack}
              handleNext={handleNext}
              isLoading={isLoading}
            >
              <div className='mb-8 lg:mb-9'>
                <h3 className='mb-[18px] text-lg font-semibold'>
                  Guardian for children
                </h3>

                <GuardianFields methods={methods} />
              </div>
            </FormWrapper>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default GuardianChildForm;
