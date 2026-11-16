import { z } from 'zod';

import { maxFileSize } from '@/constant';

export interface MeetingLayoutFormType {
  name: string;
  code?: string;
  description: string;
  photo_uuid: string;
  is_published_cms: boolean;
  version?: number | null;
}

export const defaultMeetingLayoutForm: MeetingLayoutFormType = {
  name: '',
  code: '',
  description: '',
  photo_uuid: '',
  is_published_cms: false,
};

export const meetingLayoutFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional(),
  description: z.string(),
  photo_uuid: z
    .union([
      z.string(),
      z.instanceof(File).refine(
        (file) => {
          const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
          const maxSizeInBytes = maxFileSize * 1024 * 1024;

          return allowedTypes.includes(file.type) && file.size <= maxSizeInBytes;
        },
        {
          message: `Invalid file. Only JPEG/PNG images are allowed and file size should not exceed ${maxFileSize}MB.`,
        },
      ),
    ])
    .optional()
    .nullable(),
  is_published_cms: z.boolean().default(false),
  version: z.number().nullish(),
});
