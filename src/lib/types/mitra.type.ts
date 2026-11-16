export interface MitraUnitType {
  uuid: string;
  name: string;
  category: string;
  plate_number?: string;
  status: 'tersedia' | 'disewa' | 'perawatan';
  price_per_day: number;
}

export interface MitraType {
  uuid: string;
  name: string;
  email: string;
  phone_number: string;
  address?: string;
  city?: string;
  location?: string;
  company?: string;
  cooperation_status?: 'aktif' | 'tidak_aktif' | 'ditangguhkan';
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  units?: MitraUnitType[];
  version: number;
}

export type AgentType = MitraType;
export default MitraType;
