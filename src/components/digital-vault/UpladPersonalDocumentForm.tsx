import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { personaDoclSchema } from '@/schemas/digital-vault';
import digitalAPI from '@/services/digital-vault';
import { useDigitalStore } from '@/store/digital/index';

import DragDropPlaceholder from './DragDropPlaceholder';
import FileNamePreview from './FileNamePreview';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import Textarea from '../ui/textarea';

type FormData = z.infer<typeof personaDoclSchema>;
type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function UpladPersonalDocumentForm({ setOpen }: Props) {
  const { setpersonalDocuments } = useDigitalStore();
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef(Date.now());

  const methods = useForm<FormData>({
    resolver: zodResolver(personaDoclSchema),
    defaultValues: {
      title: '',
      file: null,
      description: '',
    },
  });

  const {
    setValue,
    formState: { errors },
  } = methods;

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile) {
      setFileName(selectedFile.name);
      setValue('file', selectedFile);
      fileInputRef2.current = Date.now();
    }
  };

  const removeFile = () => {
    setFileName('');
    setValue('file', null);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data.file) return;

    setIsLoading(true);

    const formData = new FormData();

    formData.append('files', data.file);

    const body = {
      title: data.title,
      notes: data.description || '',
      type: 'personal',
    };

    try {
      await digitalAPI.uploadFile(formData, body);

      const response = await digitalAPI.getFiles();

      setpersonalDocuments(response.downloaded);
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
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DragDropPlaceholder
                  key={fileInputRef2.current}
                  file={fileName}
                  {...field}
                  ref={fileInputRef}
                  handleDivClick={handleDivClick}
                  handleFileChange={handleFileChange}
                />
              </FormControl>
              <FormMessage className='text-xs font-normal' />
            </FormItem>
          )}
        />

        <FileNamePreview fileName={fileName} removeFile={removeFile} />

        <FormField
          control={methods.control}
          name='title'
          render={({ field }) => (
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
          )}
        />

        <FormField
          control={methods.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <Label className='mt-8 block text-xs'>Add notes (optional)</Label>
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

        <Button
          isLoading={isLoading}
          type='submit'
          className='mt-8 h-[52px] w-full bg-[#25D998] text-lg font-semibold lg:ml-[62%] lg:w-[206px]'
        >
          Done
        </Button>
      </form>
    </Form>
  );
}

export default UpladPersonalDocumentForm;
