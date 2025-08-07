import { differenceInYears, isValid, parse } from 'date-fns';
import { z } from 'zod';

import { emailSchema, phoneSchema, zipCodeRegex } from './poa';

export const mainInfoAboutSchema = z.object({
  firstName: z.string().min(2, { message: 'Field is required' }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: 'Field is required' }),
  phoneNumber: phoneSchema,
});

export const aboutAddressSchema = z
  .object({
    userAddress: z.object({
      address: z.object({
        county: z.string().min(3, { message: 'Field is required' }),
        address_line_1: z.string().min(4, { message: 'Field is required' }),
        address_line_2: z.string().optional(),
        city: z.string().min(3, { message: 'Field is required' }),
        zip_code: z.string().refine((value) => zipCodeRegex.test(value), {
          message: 'Invalid zip code format',
        }),
        state: z.string().min(3, { message: 'Field is required' }),
      }),
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

            return age >= 18;
          },
          {
            message:
              'Unfortunately, in order to make a POA you must be at least 18 years old. We’d love to see you come back when you are 18',
          },
        ),
    }),
  })
  .refine(
    (data) => {
      const parsedDate = parse(
        data.userAddress.birthday,
        'MM/dd/yyyy',
        new Date(),
      );
      const age = differenceInYears(new Date(), parsedDate);

      if (data.userAddress.address.state === 'Alabama' && age < 19) {
        return false;
      }

      return true;
    },
    {
      message:
        'Unfortunately, in order to make a POA you must be at least 19 years old. We’d love to see you come back when you are 19',
      path: ['userAddress.birthday'],
    },
  );

export const relationshipSchema = z
  .object({
    status: z.string().min(6),
    partner: z.object({
      fullName: z
        .string()
        .optional()
        .refine(
          (fullName) => {
            if (fullName) {
              return fullName.length > 3;
            }

            return true;
          },
          {
            message: 'Field is required',
          },
        ),
      email: emailSchema,
    }),
  })
  .refine(
    (data) => {
      if (data.status && data.status !== 'Single') {
        return !!data.partner.fullName;
      }

      return true;
    },
    { path: ['partner.fullName'], message: 'Field is required' },
  );
