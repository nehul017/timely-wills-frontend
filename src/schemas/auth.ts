import { z } from 'zod';

import { emailSchema } from './poa';

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .refine(
    (value) => {
      const hasLowerCase = /[a-z]/.test(value);
      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumbers = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%*^&]/.test(value);

      const conditionsMet = [
        hasLowerCase,
        hasUpperCase,
        hasNumbers,
        hasSpecialChar,
      ].filter(Boolean).length;

      return conditionsMet >= 3;
    },
    {
      message: 'Password must contain the following: A-Z a-z 0-9 !@#$%*^&',
    },
  );

export const loginSchema = z.object({
  identifier: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 charcters' }),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string()
});

export const forgotPasswordSchema = z.object({
  email: emailSchema.refine((data) => !!data, { message: 'Field is required' }),
});

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Password doesn’t match',
  });

export const updateEmailSchema = z.object({
  email: emailSchema.refine((data) => !!data, { message: 'Field is required' }),
});

export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    currentPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    passwordConfirmation: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Password doesn’t match',
  });
