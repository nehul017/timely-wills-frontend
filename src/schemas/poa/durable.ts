import { z } from 'zod';

import { agentSchema, emailSchema, phoneSchema } from '.';

const guardianOfEstateSchema = z
  .object({
    fullName: z.string().min(3, { message: 'Field is required' }),
    email: emailSchema,
    phoneNumber: phoneSchema,
    postalAddress: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.fullName) {
        return data.email || data.phoneNumber || data.postalAddress;
      }
      return true;
    },
    {
      path: ['email', 'phoneNumber', 'postalAddress'],
    },
  );

export const durablePOADesignatedAgentSchema = z
  .object({
    designetedAgent: agentSchema,
    isUnderstand: z.boolean(),
    alternatedAgent: z
      .union([
        agentSchema.omit({ personType: true }),
        z
          .object({
            fullName: z.string().optional(),
            phoneNumber: z.string().optional(),
            email: z.string().optional(),
            address: z.object({
              address_line_1: z.string().optional(),
              address_line_2: z.string().optional(),
              city: z.string().optional(),
              zip_code: z.string().optional(),
              state: z.string().optional(),
            }),
          })
          .refine(
            (data) =>
              !data.fullName &&
              !data.phoneNumber &&
              !data.email &&
              !data.address.address_line_1 &&
              !data.address.city &&
              !data.address.zip_code &&
              !data.address.state,
            {
              path: ['alternatedAgent'],
            },
          ),
      ])
      .optional(),
    isAlternateAgent: z.boolean().nullable(),
    becomeEffectivePOA: z
      .string()
      .min(5, { message: 'This needs to be filled out' }),
  })
  .refine((data) => data.isUnderstand, {
    message: 'Must click I understand in order to continue',
    path: ['isUnderstand'],
  })
  .refine(
    (data) => {
      if (data.isAlternateAgent) {
        return !!data.alternatedAgent?.fullName;
      }

      return true;
    },
    {
      path: ['alternatedAgent', 'fullName'],
      message: 'Field is required',
    },
  )
  .refine((data) => data.isAlternateAgent !== null, {
    path: ['isAlternateAgent'],
    message: 'This needs to be filled out',
  });

export const durablePOAAgentPowersSchema = z
  .object({
    generalOverallAuthority: z
      .string()
      .min(3, { message: 'This needs to be filled out' }),
    isMaintenance: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isManageAccounts: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isManageProperty: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isManageRealEstate: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isManageInsuranceAndAnnuityTransactions: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isManageRetirementAccounts: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isManageGovernmentalBenefits: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isManageTaxMatters: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isManageEstateTrust: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isMakeGifts: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isManageSecurities: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isManageClaimsLitigations: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    restrictions: z.string().nullable(),
    isGuardian: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    isOver18: z.boolean().optional(),
    isRestrictions: z
      .boolean({ message: 'This needs to be filled out' })
      .nullable(),
    guardian: z
      .union([
        guardianOfEstateSchema,
        z
          .object({
            fullName: z.string().optional(),
            phoneNumber: z.string().optional(),
            email: z.string().optional(),
            postalAddress: z.string().optional(),
          })
          .refine(
            (data) =>
              !data.fullName &&
              !data.phoneNumber &&
              !data.email &&
              !data.postalAddress,
            {
              path: ['guardian'],
            },
          ),
      ])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.isGuardian === undefined) return false;

      if (data.isGuardian === true) {
        return (
          !!data.guardian?.fullName &&
          (!!data.guardian?.email ||
            !!data.guardian?.phoneNumber ||
            !!data.guardian?.postalAddress)
        );
      }

      return true;
    },
    {
      path: ['guardian'],
      message: 'If you click yes, guardian is required',
    },
  )
  .refine(
    (data) => {
      if (data.isRestrictions === true) {
        return !!data.restrictions;
      }

      return true;
    },
    { path: ['restrictions', 'isRestrictions'] },
  )
  .refine((data) => data.isMaintenance !== null, {
    path: ['isMaintenance'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isManageAccounts !== null, {
    path: ['isManageAccounts'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isManageProperty !== null, {
    path: ['isManageProperty'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isManageRealEstate !== null, {
    path: ['isManageRealEstate'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isManageInsuranceAndAnnuityTransactions !== null, {
    path: ['isManageInsuranceAndAnnuityTransactions'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isManageRetirementAccounts !== null, {
    path: ['isManageRetirementAccounts'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isManageGovernmentalBenefits !== null, {
    path: ['isManageGovernmentalBenefits'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isManageTaxMatters !== null, {
    path: ['isManageTaxMatters'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isManageEstateTrust !== null, {
    path: ['isManageEstateTrust'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isManageSecurities !== null, {
    path: ['isManageSecurities'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isMakeGifts !== null, {
    path: ['isMakeGifts'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isManageClaimsLitigations !== null, {
    path: ['isManageClaimsLitigations'],
    message: 'This needs to be filled out',
  })
  .refine((data) => data.isGuardian !== null, {
    path: ['isGuardian'],
    message: 'This needs to be filled out',
  })
  .refine(
    (data) => {
      if (data.isGuardian) {
        return data.isOver18;
      }

      return true;
    },
    {
      path: ['isOver18'],
      message: 'This needs to be filled out',
    },
  )
  .refine((data) => data.isRestrictions !== null, {
    path: ['isRestrictions'],
    message: 'This needs to be filled out',
  });
