import { z } from 'zod';

export const willCheckoutSchema = z.object({
  isSub: z.boolean({ message: 'Field is required' }),
  promocode: z.string().optional(),
  cardHolderName: z.string().min(3, { message: 'Field is required' }),
  isWillCouple: z.boolean(),
});

export const poaCheckoutSchema = willCheckoutSchema.omit({
  isSub: true,
  isWillCouple: true,
});
