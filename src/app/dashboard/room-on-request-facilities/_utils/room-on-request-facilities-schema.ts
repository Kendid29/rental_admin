import { z } from 'zod';

export interface RoomOnRequestFacilitiesFormType {
  name: string;
  code: string;
  icon_title: string;
  description: string;
  version?: number | null;
}

export const defaultRoomOnRequestFacilitiesForm: RoomOnRequestFacilitiesFormType = {
  name: '',
  code: '',
  icon_title: '',
  description: '',
};

export const roomOnRequestFacilitiesFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  icon_title: z.string(),
  description: z.string(),
  version: z.number().nullish(),
});
