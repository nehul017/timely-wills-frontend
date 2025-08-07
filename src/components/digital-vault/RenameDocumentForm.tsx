import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { renameDocSchema } from '@/schemas/digital-vault';
import digitalAPI from '@/services/digital-vault';
import { useDigitalStore } from '@/store/digital/index';

import { selectOptions } from '../../constant/digital-vault';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import Textarea from '../ui/textarea';

type FormData = z.infer<typeof renameDocSchema>;
type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function RenameDocumentForm({ setOpen }: Props) {
  const {
    selectedDocument,
    personalDocuments,
    setpersonalDocuments,
    setSignedCopyDocuments,
    signedCopyDocuments,
  } = useDigitalStore();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(renameDocSchema),
    defaultValues: {
      title: selectedDocument?.title,
      description: selectedDocument?.notes,
    },
  });

  const {
    formState: { errors },
  } = methods;
  const documentType = selectedDocument?.type;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const body = {
      type: selectedDocument?.type as string,
      title: data.title,
      fileId: selectedDocument?.id as number,
      notes: data.description || '',
    };

    setIsLoading(true);

    try {
      const { id, updatedDoc } = await digitalAPI.renameFile(body);
      if (selectedDocument?.type === 'estate') {
        setSignedCopyDocuments(
          signedCopyDocuments.map((file) =>
            file.id === id ? { ...file, ...updatedDoc } : file,
          ),
        );
      } else {
        setpersonalDocuments(
          personalDocuments.map((file) =>
            file.id === id ? { ...file, ...updatedDoc } : file,
          ),
        );
      }

      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormField
          control={methods.control}
          name='title'
          render={({ field }) =>
            documentType === 'personal' ? (
              <FormItem>
                <Label className='mt-8 block text-xs'>Document title</Label>
                <FormControl>
                  <Input
                    {...field}
                    className={`mt-2 h-[45px] border-[#8D9395] bg-[#F3F3F3] lg:h-12 ${errors.title?.message && 'focus:ring-[#E51A2980]'}`}
                    placeholder='Document title'
                  />
                </FormControl>
                <FormMessage className='text-xs font-normal' />
              </FormItem>
            ) : (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={`mt-2 h-[45px] border-[#8D9395] bg-[#F3F3F3] focus:ring-[#25D99880] lg:h-12 ${errors.title?.message ? 'custom-outline' : undefined}`}
                >
                  <SelectValue placeholder='Document title' />
                  <SelectContent>
                    <SelectGroup>
                      {selectOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
            )
          }
        />

        {documentType === 'personal' && (
          <FormField
            control={methods.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <Label className='mt-8 block text-xs'>
                  Add notes (optional)
                </Label>
                <FormControl>
                  <Textarea
                    className='mt-2'
                    placeholder='Input notes'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <div className='mt-8 flex gap-3 lg:ml-[56%]'>
          <Button
            onClick={() => setOpen(false)}
            variant='outline'
            className='hover:text-[#25D998 h-[52px] w-full border-[#25D998] text-lg font-semibold text-[#25D998] lg:w-[113px]'
          >
            Cancel
          </Button>

          <Button
            isLoading={isLoading}
            type='submit'
            className='h-[52px] w-full bg-[#25D998] text-lg font-semibold lg:w-[113px]'
          >
            Done
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default RenameDocumentForm;
