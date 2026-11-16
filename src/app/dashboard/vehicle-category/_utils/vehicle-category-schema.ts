import { z } from 'zod';

export const vehicleCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  type: z.enum(['mobil', 'motor', 'barang'], {
    message: 'Tipe kategori utama wajib dipilih',
  }),
  code: z.string().optional().default(''),
  description: z.string().optional().default(''),
  icon: z.string().nullish(),
  version: z.number().nullish(),
});

export type VehicleCategoryFormType = z.infer<typeof vehicleCategorySchema>;

export const defaultVehicleCategoryForm: VehicleCategoryFormType = {
  name: '',
  type: 'mobil',
  code: '',
  description: '',
  icon: '',
  version: 1,
};
