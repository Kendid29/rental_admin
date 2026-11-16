import { z } from 'zod';

export const galleryFormSchema = z.object({
  image_uuid: z
    .union([z.instanceof(File), z.string()])
    .refine((val) => val !== null && val !== '', {
      message: 'Image file or URL is required',
    }),
  is_active: z.boolean(),
  version: z.number().optional().nullable(),
});

export type GalleryFormType = z.infer<typeof galleryFormSchema>;

export const defaultGalleryForm: GalleryFormType = {
  image_uuid: '',
  is_active: true,
  version: null,
};
