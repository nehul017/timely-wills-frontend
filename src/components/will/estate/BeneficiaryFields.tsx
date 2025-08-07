import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { presonTypeOptions } from '@/constant/will';
import { EmailPostal } from '@/types';

import SelectTextInput from '../SelectTextInput';

type Props<T extends FieldValues> = {
  // name: Path<T>;
  methods: UseFormReturn<T>;
  emailOrPostal: EmailPostal;
  // isBackup?: boolean;
};

function BeneficiaryFields<T extends FieldValues>({
  // isBackup,
  methods,
  // name,
  emailOrPostal,
}: Props<T>) {
  const {
    formState: { errors },
  } = methods;

  return (
    <>
      <FormField
        control={methods.control}
        name={`backups.fullName` as Path<T>}
        render={({ field }) => (
          <FormItem className='mb-6'>
            <Label className='flex items-center justify-between text-xs'>
              <div>
                Full legal name
                <span className='text-danger'>*</span>
              </div>
            </Label>
            <FormControl>
              <Input
                {...field}
                className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors['backups?.fullName'] && 'focus:ring-danger-outline'}`}
                placeholder='Full legal name'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <SelectTextInput
        label='This person is my'
        methods={methods}
        name={'backups.personType' as Path<T>}
        options={presonTypeOptions}
      />

      {emailOrPostal === 'email' ? (
        <FormField
          control={methods.control}
          name={`backups.email` as Path<T>}
          render={({ field }) => (
            <FormItem className='mb-6'>
              <Label className='flex items-center justify-between text-xs'>
                <div>
                  Email address
                  <span className='text-danger'>*</span>
                </div>
              </Label>
              <FormControl>
                <Input
                  {...field}
                  className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors['backups.fullName'] && 'focus:ring-danger-outline'}`}
                  placeholder='Email address'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={methods.control}
          name={`backups.address` as Path<T>}
          render={({ field }) => (
            <FormItem className='mb-6'>
              <Label className='flex items-center justify-between text-xs'>
                <div>
                  Postal address
                  <span className='text-danger'>*</span>
                </div>
              </Label>
              <FormControl>
                <Input
                  {...field}
                  className={`mt-2 h-[48px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors['backups?.address'] && 'focus:ring-danger-outline'}`}
                  placeholder='Postal address'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}

export default BeneficiaryFields;
