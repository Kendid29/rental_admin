export interface ActivityItemType {
  uuid: string;
  title: string;
  description: string;
  image: {
    uuid: string;
    url: string;
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
