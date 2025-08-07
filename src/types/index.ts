import { z } from 'zod';

import { mainInfoAboutSchema, relationshipSchema } from '@/schemas/about';
import {
  durablePOAAgentPowersSchema,
  durablePOADesignatedAgentSchema,
} from '@/schemas/poa/durable';
import {
  livingWillWishesSchema,
  specificWishesSchema,
} from '@/schemas/poa/living-will';
import {
  medicalPOAAgentPowersSchema,
  medicalPOAAgentSchema,
  medicalPOAGuardianSchema,
  medicalPOAPrimaryPhysicianSchema,
} from '@/schemas/poa/medical';
import { executorSchema } from '@/schemas/will/executors';

export interface ErrorResponse {
  message: string;
}

export interface LayoutProps {
  children?: React.ReactNode;
}

export interface IconProps {
  className?: string;
  fill?: string;
}

export interface AccordionData {
  number: string;
  title: string;
  description: string;
  fields: AccordionField[];
}

export interface AccordionField {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}

export type WillSection =
  | 'family'
  | 'estate'
  | 'gifts'
  | 'executors'
  | 'review'
  | 'download';

export type StepTitle =
  | 'Designated Agent'
  | 'Powers you wish to grant'
  | 'Signing'
  | 'Review'
  | 'Wishes'
  | 'Specific Wishes'
  | 'Agent Powers'
  | 'Guardian'
  | 'Primary Physician'
  | 'Name'
  | 'Date of birth'
  | 'Address'
  | 'Relationship status'
  | 'Download';

export interface Step {
  step: number;
  title: StepTitle;
}

export interface AddressProps {
  city: string;
  address_line_1: string;
  address_line_2?: string;
  state: string;
  zip_code: string;
}

export interface Agent {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address: AddressProps;
}

export interface AgentProps {
  designetedAgent: Agent;
  alternatedAgent: Agent;
}

export type FormDataDurablePOA = z.infer<
  typeof durablePOADesignatedAgentSchema
>;
export type FormDataAgentPowers = z.infer<typeof durablePOAAgentPowersSchema>;
export type LivingWillWishesForm = z.infer<typeof livingWillWishesSchema>;
export type FormDataSpecificWishes = z.infer<typeof specificWishesSchema>;
export type MedicalPOAAgentForm = z.infer<typeof medicalPOAAgentSchema>;
export type MedicalPOAAgentPowers = z.infer<typeof medicalPOAAgentPowersSchema>;
export type MedicalPOAGuardianForm = z.infer<typeof medicalPOAGuardianSchema>;
export type AboutMainFormData = z.infer<typeof mainInfoAboutSchema>;
export type RelationshipFormData = z.infer<typeof relationshipSchema>;
export type MedicalPrimaryPhysicianForm = z.infer<
  typeof medicalPOAPrimaryPhysicianSchema
>;
export type ExecutorFormData = z.infer<typeof executorSchema>;

export type EmailPostal = 'email' | 'postal';
