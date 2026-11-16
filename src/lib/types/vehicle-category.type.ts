export interface VehicleCategoryType {
  uuid: string;
  name: string;
  code: string;
  type: 'mobil' | 'motor' | 'barang';
  description?: string;
  icon?: string;
  unit_count: number;
  version: number;
  created_at?: string;
  updated_at?: string;
}

export default VehicleCategoryType;
