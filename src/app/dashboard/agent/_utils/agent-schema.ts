import { z } from 'zod';

export interface AgentFormType {
  name: string;
  email: string;
  phone_number: string;
  location?: string | null;
  company: string;
  version?: number | null;
}

export const agentFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().min(1, 'Phone number is required'),
  location: z.string().nullish(),
  company: z.string().min(1, 'Company is required'),
  version: z.number().nullish(),
});

export const defaultAgentForm: AgentFormType = {
  name: '',
  email: '',
  phone_number: '62',
  location: '',
  company: '',
  version: 1,
};
