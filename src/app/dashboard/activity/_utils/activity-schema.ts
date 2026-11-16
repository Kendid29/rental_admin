import { z } from 'zod';

export const activityFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.any().optional(),
  is_active: z.boolean(),
});

export type ActivityFormType = z.infer<typeof activityFormSchema>;

export const defaultActivityForm: ActivityFormType = {
  title: '',
  description: '',
  image: '',
  is_active: true,
};

