export interface GalleryItemType {
  uuid: string;
  image_uuid: string;
  imageurl: string;
  image_url: string;
  image: {
    uuid: string;
    url: string;
  };
  status: 'active' | 'inactive';
  createdAt: string;
  created_at: string;
  version: number;
}
