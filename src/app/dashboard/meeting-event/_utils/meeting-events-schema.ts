import { z } from 'zod';

import { maxFileSize } from '@/constant';

export interface MeetingEventsFormType {
  name: string;
  code: string;
  description: string;
  capacity: number;
  location: string;
  rate: number;
  meeting_packages: string[];
  layouts: string[];
  images: any[];
  is_published_cms: boolean;
  version?: number | null;
}

export const defaultMeetingEventsForm: MeetingEventsFormType = {
  name: '',
  code: '',
  description: '',
  location: '',
  rate: 0,
  meeting_packages: [],
  layouts: [],
  capacity: 0,
  images: [],
  is_published_cms: false,
  version: null,
};

export const meetingEventsFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string(),
  location: z.string().min(1, 'Location is required'),
  rate: z.number().min(1, 'Rate is required'),
  meeting_packages: z.array(z.string()).min(1, 'Meeting packages is required'),
  layouts: z.array(z.string()).min(1, 'Layouts is required'),
  is_published_cms: z.boolean(),
  capacity: z.number().min(1, 'Capacity is required'),
  images: z
    .array(
      z.union([
        z.string({ message: 'Image is required' }).min(1, { message: 'Image is required' }),
        z.instanceof(File, { message: 'Image is required' }).refine(
          (file) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const maxSizeInBytes = maxFileSize * 1024 * 1024;

            return allowedTypes.includes(file.type) && file.size <= maxSizeInBytes;
          },
          {
            message: `Invalid file. Only JPEG/PNG images are allowed and file size should not exceed ${maxFileSize}MB.`,
          },
        ),
      ]),
    )
    .min(1, 'Photo is required'),
  version: z.number().nullish(),
});
