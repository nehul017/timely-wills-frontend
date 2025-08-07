import { z } from 'zod';

import { emailSchema, phoneRegex } from '../poa';

export const beneficiarySchema = z
  .object({
    fullName: z.string().min(3, { message: 'Field is required' }),
    email: emailSchema,
    address: z.string(),
    personType: z.string().min(3, { message: 'Field is required' }),
  })
  .refine((data) => data.email || data.address, {
    path: ['email'],
    message: 'Field is required',
  })
  .refine((data) => data.email || data.address, {
    path: ['address'],
    message: 'Field is required',
  });

export const charitySchema = z.object({
  fullName: z.string().min(3, { message: 'Field is required' }),
  phoneNumber: z.string().refine(
    (data) => {
      if (data) {
        return phoneRegex.test(data);
      }

      return true;
    },
    { message: 'Invalid phone number' },
  ),
  websiteLink: z.string().optional(),
});

export const backupSchema = z
  .object({
    backupType: z.string().min(4, { message: 'Field is required' }),
    fullName: z.string().min(3, { message: 'Field is required' }),
    phoneNumber: z
      .string()
      .optional()
      .refine(
        (data) => {
          if (data) {
            return phoneRegex.test(data);
          }

          return true;
        },
        { message: 'Invalid phone number' },
      ),
    websiteLink: z.string().optional(),
    email: emailSchema.optional(),
    address: z.string().optional(),
    personType: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.backupType === 'backupBeneficiary') {
        return data?.personType?.length;
      }

      return true;
    },

    {
      path: ['personType'],
      message: 'Field is required',
    },
  )
  .refine(
    (data) => {
      if (data.backupType === 'backupBeneficiary') {
        return data.fullName;
      }

      return true;
    },

    {
      path: ['fullName'],
      message: 'Field is required',
    },
  )
  .refine(
    (data) => {
      if (data.backupType === 'backupBeneficiary') {
        return data.email || data.address;
      }

      return true;
    },

    {
      path: ['email'],
      message: 'Field is required',
    },
  )
  .refine(
    (data) => {
      if (data.backupType === 'backupBeneficiary') {
        return data.email || data.address;
      }

      return true;
    },

    {
      path: ['address'],
      message: 'Field is required',
    },
  );

export const backupsSchema = z.object({
  backups: backupSchema,
});

export const exclusion = z.object({
  fullName: z.string().min(3, { message: 'Field is required' }),
  whyIsExcluded: z.string(),
});

export const exlusionsSchema = z
  .object({
    isExclusions: z.boolean().nullable(),
    exclusions: z.array(exclusion),
  })
  .refine((data) => data.isExclusions !== null, {
    message: 'This needs to be filled out',
    path: ['isExclusions'],
  });
