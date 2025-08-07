import { z } from 'zod';

export const phoneRegex = /^1?\s?\(\d{3}\)\s\d{3}-\d{4}$/;
export const zipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;

export const emailSchema = z.string().refine(
  (email) => {
    if (email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    return true;
  },
  {
    message: 'Invalid email address',
  },
);

export const phoneSchema = z
  .string()
  .optional()
  .refine(
    (phone) => {
      if (phone) {
        return phoneRegex.test(phone);
      }
      return true;
    },
    {
      message: 'Invalid phone number format',
    },
  );

export const signingSchema = z
  .object({
    isWitnesses: z.boolean().nullable(),
    isNotarization: z.boolean().nullable(),
  })
  .refine((data) => data.isNotarization !== null, {
    message: 'This needs to be filled out',
    path: ['isNotarization'],
  })
  .refine((data) => data.isWitnesses !== null, {
    message: 'This needs to be filled out',
    path: ['isWitnesses'],
  });

export const addressSchema = z
  .object({
    address_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
    city: z.string().optional(),
    zip_code: z
      .string()
      .optional()
      .refine((val) => !val || zipCodeRegex.test(val), {
        message: 'Invalid zip code format',
      }),
    state: z.string().optional(),
  })
  .refine(
    (address) => {
      const hasAddressLine1 = !!address.address_line_1;
      const hasCity = !!address.city;
      const hasZipCode = !!address.zip_code;
      const hasState = !!address.state;

      const allRequiredFieldsPresent =
        hasAddressLine1 && hasCity && hasZipCode && hasState;

      const noFieldsFilled =
        !hasAddressLine1 && !hasCity && !hasZipCode && !hasState;

      return noFieldsFilled || allRequiredFieldsPresent;
    },
    {
      message: 'All address fields must be filled out if one is filled',
      path: ['address_line_2'],
    },
  );

export const agentSchema = z.object({
  fullName: z.string().min(3, { message: 'Field is required' }),
  phoneNumber: z.string().refine((value) => phoneRegex.test(value), {
    message: 'Invalid phone number format',
  }),
  personType: z.string().min(3, { message: 'Field is required' }),
  email: emailSchema,
  address: z.object({
    address_line_1: z.string().min(4, { message: 'Field is required' }),
    address_line_2: z.string().optional(),
    city: z.string().min(3, { message: 'Field is required' }),
    zip_code: z.string().refine((value) => zipCodeRegex.test(value), {
      message: 'Invalid zip code format',
    }),
    state: z.string().min(3, { message: 'Field is required' }),
  }),
});

export const optionalAgentSchema = z.object({
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  address: z
    .object({
      address_line_1: z.string().optional(),
      address_line_2: z.string().optional(),
      city: z.string().optional(),
      zip_code: z.string().optional(),
      state: z.string().optional(),
    })
    .optional(),
});
