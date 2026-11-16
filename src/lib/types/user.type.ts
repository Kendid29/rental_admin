import { BasicRelationType } from './globals';
import RoleType from './role.type';

export interface UserInformationType {
  uuid: string;
  email: string;
  version: number;
}

export interface UserType {
  uuid: string;
  name: string;
  phone_number: string;
  birth_date?: string;
  location?: string;
  address?: string;
  role: RoleType;
  user: UserInformationType;
  version: number;
  membership: BasicRelationType;

}

export default UserType;

