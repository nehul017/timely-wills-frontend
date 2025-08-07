import { z } from 'zod';

import { beneficiarySchema } from './estate';

export const isGiftSchema = z
  .object({
    isGifts: z.boolean().nullable(),
  })
  .refine((data) => data.isGifts !== null, {
    message: 'This needs to be filled out',
    path: ['isGifts'],
  });

export const asignGiftsSchema = z
  .object({
    giftType: z.string().min(4, { message: 'This needs to be filled out' }),
    message: z.string().optional(),
    money: z.string().refine(
      (data) => {
        if (data) {
          return /^\$[1-9][0-9]{0,2}(?:,?[0-9]{3})*$/.test(data);
        }

        return true;
      },
      { message: 'Invalid data' },
    ),
    giftDescription: z.string().refine(
      (data) => {
        if (data) {
          return data.length >= 3;
        }

        return true;
      },
      { message: 'Description should be at least 3 characters' },
    ),
    beneficiary: beneficiarySchema,
    beneficiaryId: z.string().min(1, { message: 'Please select a person' }),
  })
  .refine(
    (data) => {
      if (data.giftType) {
        return data.giftDescription || data.money;
      }
    },
    {
      path: ['giftDescription'],
      message: 'Field is required',
    },
  )
  .refine(
    (data) => {
      if (data.giftType) {
        return data.giftDescription || data.money;
      }
    },
    {
      path: ['money'],
      message: 'Field is required',
    },
  );
