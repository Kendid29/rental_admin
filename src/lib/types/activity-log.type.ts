import { PaginationType } from './globals';

export interface ActivityLogResource {
  type: string;
  table: string;
  uuid: string;
  label: string;
}

export interface ActivityLogActor {
  type: string;
  uuid: string;
  name: string;
  email: string;
}

export interface ActivityLogChanges {
  old: Record<string, any> | null;
  new: Record<string, any> | null;
}

export interface ActivityLogRequest {
  method: string;
  path: string;
  ip_address: string;
  user_agent: string;
}

export interface ActivityLogMetadata {
  model?: string;
  table?: string;
  [key: string]: any;
}

export interface ActivityLogItem {
  uuid: string;
  action: 'created' | 'updated' | 'deleted' | string;
  module: string;
  description: string;
  resource: ActivityLogResource | null;
  actor: ActivityLogActor | null;
  changes: ActivityLogChanges | null;
  request: ActivityLogRequest | null;
  metadata: ActivityLogMetadata | null;
  created_at: string;
  created_at_timestamp: number;
}

export interface GetActivityLogsResponse {
  success: boolean;
  message: string;
  data: ActivityLogItem[];
  pagination: PaginationType | null;
}

export interface GetActivityLogDetailResponse {
  success: boolean;
  message: string;
  data: ActivityLogItem;
}
