import { CreatedUpdatedType } from './globals';

export interface PermissionType {
  module_name: string;
  name?: string;
  accesses: {
    [key: string]: boolean;
  }[];
}

export interface AllPermissionsType {
  uuid: string;
  module_key: string;
  module_name: string;
  permission_name: string;
}
