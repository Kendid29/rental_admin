export default interface VoucherCategoryType {
  uuid: string;
  name: string;
  code: string;
  description?: string;
  queue: number;
  is_published: boolean;
  is_published_cms: boolean;
  version: number;
}

