import { z } from 'zod';

const MAX_FILE_SIZE = 5000000;

export const estateSignedCopySchema = z.object({
  title: z.string().min(1, { message: 'Field is required' }),
  file: z
    .any()
    .refine((file: File) => file, 'File is required')
    .refine((file: File) => file?.size < MAX_FILE_SIZE, 'Max size is 5MB.'),
});

export const personaDoclSchema = z.object({
  title: z.string().min(1, { message: 'Field is required' }),
  file: z
    .any()
    .refine((file: File) => file, 'File is required')
    .refine((file: File) => file?.size < MAX_FILE_SIZE, 'Max size is 5MB.'),
  description: z.string().nullable(),
});

export const renameDocSchema = z.object({
  title: z.string().min(1, { message: 'Field is required' }),
  description: z.string().optional(),
});
