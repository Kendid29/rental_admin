import { CreatedUpdatedType } from './globals';

interface RoleType extends CreatedUpdatedType {
  uuid: string;
  name: string;
  code: string;
  description: string;
  version: number;
  is_default: boolean;
}

export default RoleType;

