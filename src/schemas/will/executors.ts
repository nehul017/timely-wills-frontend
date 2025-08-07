import { z } from 'zod';

import { emailSchema } from '../poa';

export const executorSchema = z
  .object({
    fullName: z.string().min(3, { message: 'Field is required' }),
    email: emailSchema,
    address: z.string(),
    personType: z.string().min(3, { message: 'Field is required' }),
    isOver18: z.boolean().refine((data) => data === true, {
      message: 'This needs to be filled out',
    }),
  })
  .refine((data) => data.email || data.address, {
    path: ['email'],
    message: 'Field is required',
  })
  .refine((data) => data.email || data.address, {
    path: ['address'],
    message: 'Field is required',
  });

export const compensationSchema = z
  .object({
    compensation: z.boolean().nullable(),
  })
  .refine((data) => data.compensation !== null, {
    message: 'This needs to be filled out',
    path: ['compensation'],
  });

export const wishesSchema = z
  .object({
    isWishes: z.boolean({ message: 'This needs to be filled out' }).nullable(),
    specialWishes: z.string().optional(),
    isSelfProvingAffidavit: z.boolean().nullable(),
    isNotarization: z.boolean().nullable(),
  })
  .refine(
    (data) => {
      if (data.isWishes) {
        return data.specialWishes;
      }

      return true;
    },
    { message: 'Field is required', path: ['specialWishes'] },
  )
  .refine((data) => data.isWishes !== null, {
    message: 'This needs to be filled out',
    path: ['isWishes'],
  })
  .refine((data) => data.isNotarization !== null, {
    message: 'This needs to be filled out',
    path: ['isNotarization'],
  })
  .refine((data) => data.isSelfProvingAffidavit !== null, {
    message: 'This needs to be filled out',
    path: ['isSelfProvingAffidavit'],
  });
