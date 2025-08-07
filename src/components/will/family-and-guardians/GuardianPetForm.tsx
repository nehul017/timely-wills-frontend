'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form } from '@/components/ui/form';
import useWillSearchParams from '@/hooks/use-will-search-params';
import useWillRequestBody from '@/hooks/will/use-will-request-body';
import { singleGuardianSchema } from '@/schemas/will/family';
import willAPI from '@/services/will';
import { FamilyMember, WillRequestBody } from '@/services/will/types';
import { useProgressStepStore } from '@/store/progress-steps';
import { useFamilyMembersState } from '@/store/will/family-and-guardians';
import { Pet } from '@/store/will/family-and-guardians/types';
import { shouldCallAPI } from '@/utils';

import GuardianFields from './GuardianFields';
import FormWrapper from '../../FormWrapper';
import InfoPopup from '../../InfoPopup';

type FormData = z.infer<typeof singleGuardianSchema>;

function GuardianPetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNextClicked, setIsNextClicked] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const { pets, children, updatePets, setIsCompletedFamilySection } =
    useFamilyMembersState();
  const { decreaseSubStep, increaseWillMainStep, setSubStep } =
    useProgressStepStore();
  const { updateSearchParams } = useWillSearchParams();
  const { willRequestBody } = useWillRequestBody();
  const router = useRouter();

  const guardian = pets[0]?.guardian;
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
    const preparedPets: FamilyMember[] = pets.map((pet) => ({
      ...pet,
      guardian: [{ ...guardian, email: guardian.email || null }],
      type: 'pet',
      birthday: null,
    }));

    const preparedKids: FamilyMember[] = children.map((child, i) => ({
      ...child,
      guardian: children[i]?.guardian ? [children[i].guardian] : [],
      type: 'child',
      petType: null,
    }));

    const bodyForRequest: WillRequestBody = {
      ...willRequestBody,
      family: [...preparedKids, ...preparedPets],
      isPet: !!pets.length,
      isChildren: !!children.length,
      isCompletedFamilySection: true,
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

    setIsNextClicked(true);

    const { isOver18, ...guardian } = getValues();
    const petsWithGuardian: Pet[] = pets.map((pet) => ({
      ...pet,
      guardian: { ...guardian, email: guardian.email || null },
    }));

    if (
      !shouldCallAPI(getValues(), defaultData) ||
      pets.some((pet) => !pet.guardian?.fullName)
    ) {
      setIsNextLoading(true);
      try {
        await submitData(getValues(), true);
        updatePets(petsWithGuardian);
        setIsCompletedFamilySection(true);
        increaseWillMainStep();
        setSubStep(0);
        updateSearchParams('estate');
      } catch (error) {
        console.log(error);
        setIsNextLoading(false);
      } finally {
        setIsNextLoading(false);
      }
    } else {
      updateSearchParams('estate');
      increaseWillMainStep();
      setSubStep(0);
    }
  };

  const handleBack = () => {
    decreaseSubStep();
  };

  const onSubmit = async (data: FormData) => {
    if (isNextClicked) return;
    setIsLoading(true);

    try {
      await submitData(data);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <h2 className='h3 mb-6 lg:mb-9'>Choose a guardian for your Pets</h2>
        <InfoPopup />
      </div>

      <div className='w-full lg:max-w-[690px]'>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormWrapper
              handleBack={handleBack}
              handleNext={handleNext}
              isLoading={isLoading}
              isNextLoading={isNextLoading}
            >
              <div className='mb-8 lg:mb-9'>
                <h3 className='mb-[18px] text-lg font-semibold'>
                  Guardian for pets
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

export default GuardianPetForm;
