import { differenceInYears, isValid, parse } from 'date-fns';
import { z } from 'zod';

import { emailSchema, phoneRegex } from '../poa';

const childSchema = z.object({
  fullName: z.string().min(3, { message: 'Field is required' }),
  birthday: z
    .string()
    .refine(
      (value) => {
        const parsedDate = parse(value, 'MM/dd/yyyy', new Date());
        const year = value.split('/').pop();

        if (year?.length !== 4) {
          return false;
        }

        return isValid(parsedDate);
      },
      {
        message: 'Please enter a valid date in the format mm/dd/yyyy',
      },
    )
    .refine(
      (value) => {
        const parsedDate = parse(value, 'MM/dd/yyyy', new Date());
        const age = differenceInYears(new Date(), parsedDate);

        return age < 18;
      },
      {
        message: 'Your child should be under 18',
      },
    ),
});

export const petSchema = z.object({
  fullName: z.string().min(3, { message: 'Field is required' }),
  petType: z.string().min(3, { message: 'Field is required' }),
});

export const familySchema = z
  .object({
    isChildren: z.boolean().nullable(),
    children: z.array(childSchema),
  })
  .refine((data) => data.isChildren !== null, {
    message: 'This needs to be filled out',
    path: ['isChildren'],
  });

export const petsSchema = z
  .object({
    isPet: z.boolean().nullable(),
    pets: z.array(petSchema),
  })
  .refine((data) => data.isPet !== null, {
    message: 'This needs to be filled out',
    path: ['isPet'],
  });

export const singleGuardianSchema = z
  .object({
    fullName: z.string().min(3, { message: 'Field is required' }),
    email: emailSchema,
    address: z.string(),
    phoneNumber: z.string().refine((value) => phoneRegex.test(value), {
      message: 'Invalid phone number format',
    }),
    personType: z.string().min(3, { message: 'Field is required' }),
    isOver18: z
      .boolean()
      .refine((data) => data, { message: 'This needs to be filled out' }),
  })
  .refine((data) => data.email || data.address, {
    path: ['email'],
    message: 'Field is required',
  })
  .refine((data) => data.email || data.address, {
    path: ['address'],
    message: 'Field is required',
  });

export const petGuardianSchema = z.object({
  guardians: z.array(singleGuardianSchema),
});
