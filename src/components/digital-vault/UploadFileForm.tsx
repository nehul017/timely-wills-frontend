import { zodResolver } from '@hookform/resolvers/zod';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { estateSignedCopySchema } from '@/schemas/digital-vault';
import digitalAPI from '@/services/digital-vault';
import { useDigitalStore } from '@/store/digital/index';

import DragDropPlaceholder from './DragDropPlaceholder';
import FileNamePreview from './FileNamePreview';
import { selectOptions } from '../../constant/digital-vault';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type FormData = z.infer<typeof estateSignedCopySchema>;
type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function UploadFileForm({ setOpen }: Props) {
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef(Date.now());

  const { setSignedCopyDocuments } = useDigitalStore();

  const methods = useForm<FormData>({
    resolver: zodResolver(estateSignedCopySchema),
    defaultValues: {
      title: '',
      file: null,
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
      type: 'estate',
    };

    try {
      await digitalAPI.uploadFile(formData, body);

      const response = await digitalAPI.getFiles();

      setSignedCopyDocuments(response.downloaded);
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
              </FormControl>
              <FormMessage className='text-xs font-normal' />
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

export default UploadFileForm;
