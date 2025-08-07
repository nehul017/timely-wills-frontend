import { z } from 'zod';

export const livingWillWishesSchema = z
  .object({
    isTerminalLifeSustainingMeasures: z.boolean().nullable(),
    isTerminalArtificialNutritionHydration: z.boolean().nullable(),
    isPermanentLifeSustainingMeasures: z.boolean().nullable(),
    isPermanentArtificialNutritionHydration: z.boolean().nullable(),
    isAuthorizePainAlleviationTreatment: z.boolean().nullable(),
  })
  .refine((data) => data.isTerminalLifeSustainingMeasures !== null, {
    message: 'This needs to be filled out',
    path: ['isTerminalLifeSustainingMeasures'],
  })
  .refine((data) => data.isTerminalArtificialNutritionHydration !== null, {
    message: 'This needs to be filled out',
    path: ['isTerminalArtificialNutritionHydration'],
  })
  .refine((data) => data.isPermanentLifeSustainingMeasures !== null, {
    message: 'This needs to be filled out',
    path: ['isPermanentLifeSustainingMeasures'],
  })
  .refine((data) => data.isPermanentArtificialNutritionHydration !== null, {
    message: 'This needs to be filled out',
    path: ['isPermanentArtificialNutritionHydration'],
  })
  .refine((data) => data.isAuthorizePainAlleviationTreatment !== null, {
    message: 'This needs to be filled out',
    path: ['isAuthorizePainAlleviationTreatment'],
  });

export const specificWishesSchema = z
  .object({
    isOrganDonation: z.boolean().nullable(),
    endOfLifeCareLocation: z
      .string()
      .min(4, { message: 'This needs to be filled out' }),
    isAdditionalWishes: z.boolean().optional(),
    additionalWishes: z.string().nullable(),
  })
  .refine((data) => data.isOrganDonation !== null, {
    path: ['isOrganDonation'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isAdditionalWishes !== undefined, {
    message: 'This needs to be filled out',
    path: ['isAdditionalWishes'],
  })
  .refine(
    (data) => {
      if (data.isAdditionalWishes === true) {
        return !!data.additionalWishes;
      }

      return true;
    },
    { path: ['additionalWishes', 'isAdditionalWishes'] },
  );
