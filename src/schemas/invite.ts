import { z } from 'zod';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const inviteSchema = z.object({
  email: z.string().refine((data) => emailRegex.test(data), {
    message: 'Invalid email address',
  }),
  promocode: z.string().optional(),
});
