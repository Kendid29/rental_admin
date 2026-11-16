import { FileStorageType } from './globals/index';
import { PermissionType } from './permission.type';

export interface AuthType {
  user: {
    uuid: string;
    email: string;
    version: number;
  };
  profile: {
    uuid: string;
    name: string;
    photo: FileStorageType;
  };
  permissions: PermissionType[];
}

