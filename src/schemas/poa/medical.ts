import { z } from 'zod';

import {
  addressSchema,
  agentSchema,
  emailSchema,
  optionalAgentSchema,
  phoneRegex,
} from '.';

const certainDateSchema = z.object({
  month: z.string().min(3, { message: 'Field is required' }),
  day: z.string().min(2, { message: 'Field is required' }),
  year: z.string().min(4, { message: 'Field is required' }),
});

export const medicalPOAAgentSchema = z
  .object({
    designetedAgent: agentSchema,
    alternatedAgent: z
      .union([
        agentSchema.omit({ personType: true }),
        optionalAgentSchema.refine(
          (data) =>
            !data.fullName &&
            !data.phoneNumber &&
            !data.email &&
            !data?.address?.address_line_1 &&
            !data?.address?.city &&
            !data?.address?.zip_code &&
            !data?.address?.state,
          {
            path: ['alternatedAgent'],
          },
        ),
      ])
      .optional(),
    secondAlternatedAgent: z
      .union([
        agentSchema.omit({ personType: true }),
        optionalAgentSchema.refine(
          (data) =>
            !data.fullName &&
            !data.phoneNumber &&
            !data.email &&
            !data?.address?.address_line_1 &&
            !data?.address?.city &&
            !data?.address?.zip_code &&
            !data?.address?.state,
          {
            path: ['secondAlternatedAgent'],
          },
        ),
      ])
      .optional(),
    isAlternateAgent: z.boolean().nullable(),
    is2ndAlternateAgent: z.boolean().nullable(),
  })
  .refine(
    (data) => {
      if (data.isAlternateAgent) {
        return !!data.alternatedAgent?.fullName;
      }

      return true;
    },
    { path: ['alternatedAgent', 'fullName'], message: 'Field is required' },
  )
  .refine(
    (data) => {
      if (data.is2ndAlternateAgent) {
        return !!data.secondAlternatedAgent?.fullName;
      }

      return true;
    },
    {
      path: ['secondAlternatedAgent', 'fullName'],
      message: 'Field is required',
    },
  )
  .refine((data) => data.isAlternateAgent !== null, {
    path: ['isAlternateAgent'],
    message: 'This needs to be filled out',
  });

export const medicalPOAAgentPowersSchema = z
  .object({
    makeDecision: z
      .string()
      .optional()
      .refine((data) => data?.length, {
        message: 'This needs to be filled out',
      }),
    hipaaAuthorization: z.boolean().nullable(),
    isLimitations: z
      .boolean()
      .optional()
      .refine((data) => data !== undefined, {
        message: 'This needs to be filled out',
      }),
    limitations: z.string().nullable(),
    certainDate: z
      .union([
        certainDateSchema,
        z
          .object({
            month: z.string().optional(),
            day: z.string().optional(),
            year: z.string().optional(),
          })
          .refine(
            (data) =>
              !data.month &&
              !data.day &&
              !data.year && {
                path: ['certainDate'],
              },
          ),
      ])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.isLimitations) {
        return !!data.limitations;
      }

      return true;
    },
    { path: ['limitations', 'isLimitations'] },
  )
  .refine(
    (data) => {
      if (data.makeDecision === 'On a certain date that I will specify') {
        return (
          !!data.certainDate?.day &&
          !!data.certainDate?.month &&
          data.certainDate.year
        );
      }

      return true;
    },
    {
      path: ['certainDate'],
      message: 'This needs to be filled out',
    },
  )
  .refine((data) => data.hipaaAuthorization !== null, {
    path: ['hipaaAuthorization'],
    message: 'This needs to be filled out',
  });

export const medicalPOAGuardianSchema = z
  .object({
    isGuardian: z.boolean().nullable(),
    isAgentGuardian: z.boolean().optional(),
    guardian: z
      .union([
        agentSchema.omit({ personType: true }),
        optionalAgentSchema.refine(
          (data) =>
            !data.fullName &&
            !data.phoneNumber &&
            !data.email &&
            !data.address?.address_line_1 &&
            !data.address?.city &&
            !data.address?.zip_code &&
            !data.address?.state,
          {
            path: ['guardian'],
          },
        ),
      ])
      .optional(),
  })
  .refine((data) => data.isGuardian !== null, {
    path: ['isGuardian'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isAgentGuardian !== undefined || !data.isGuardian, {
    path: ['isAgentGuardian'],
    message: 'This needs to be filled out',
  })
  .refine(
    (data) => {
      if (data.isGuardian) {
        return !!data.guardian?.fullName;
      }

      return true;
    },
    { path: ['guardian', 'fullName'], message: 'Field is required' },
  );

export const medicalPOAPrimaryPhysicianSchema = z
  .object({
    isPhysician: z.boolean().nullable(),
    physician: z
      .union([
        z.object({
          fullName: z.string().min(3, { message: 'Field is required' }),
          phoneNumber: z.string().refine((value) => phoneRegex.test(value), {
            message: 'Invalid phone number format',
          }),
          email: emailSchema,
          address: addressSchema,
        }),
        optionalAgentSchema.refine(
          (data) =>
            !data.fullName &&
            !data.phoneNumber &&
            !data.email &&
            !data.address?.address_line_1 &&
            !data.address?.city &&
            !data.address?.zip_code &&
            !data.address?.state,
          {
            path: ['physician'],
          },
        ),
      ])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.isPhysician) {
        return !!data.physician?.fullName;
      }

      return true;
    },
    { path: ['physician', 'fullName'], message: 'Field is required' },
  )
  .refine((data) => data.isPhysician !== null, {
    path: ['isPhysician'],
    message: 'This needs to be filled out',
  });
