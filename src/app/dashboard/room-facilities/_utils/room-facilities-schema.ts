import { z } from 'zod';

export interface RoomFacilitiesFormType {
  name: string;
  code: string;
  description: string;
  version?: number | null;
  icon_title: string;
}

export const defaultRoomFacilitiesForm: RoomFacilitiesFormType = {
  name: '',
  code: '',
  description: '',
  icon_title: '',
};

export const roomFacilitiesFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string(),
  version: z.number().nullish(),
  icon_title: z.string(),
});
