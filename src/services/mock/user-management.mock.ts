import { createSuccessResponse } from './common';
import { loadFromStorage, saveToStorage } from './storage';
import { MockRequestContext, MockResult } from './types';

export interface RoleRecord {
  uuid: string;
  name: string;
  code: string;
  description: string;
  version: number;
  is_default: boolean;
  created: {
    at: string;
    by: string;
  };
  updated: {
    at: string;
    by: string;
  };
}

export interface UserRecord {
  uuid: string;
  name: string;
  phone_number: string;
  birth_date?: string;
  location?: string;
  role: RoleRecord;
  user: {
    uuid: string;
    email: string;
    version: number;
  };
  version: number;
  status: 'aktif' | 'tidak_aktif';
  membership: {
    uuid: string;
    name: string;
  };
  user_point: {
    uuid: string;
    point: number;
  };
}

const createRole = (role: Omit<RoleRecord, 'created' | 'updated'>): RoleRecord => ({
  ...role,
  created: {
    at: '2026-04-01T08:00:00Z',
    by: 'system',
  },
  updated: {
    at: '2026-04-15T08:00:00Z',
    by: 'system',
  },
});

const defaultRoles: RoleRecord[] = [
  createRole({
    uuid: 'role-master-admin',
    name: 'Master Admin',
    code: 'master_admin',
    description: 'Akses penuh ke semua modul platform Rentaku',
    version: 1,
    is_default: true,
  }),
  createRole({
    uuid: 'role-admin',
    name: 'Admin Operasional',
    code: 'admin',
    description: 'Admin operasional harian untuk transaksi, unit, dan mitra',
    version: 1,
    is_default: false,
  }),
  createRole({
    uuid: 'role-front-office',
    name: 'Front Office',
    code: 'front_office',
    description: 'Staff konfirmasi transaksi dan layanan pelanggan',
    version: 1,
    is_default: false,
  }),
  createRole({
    uuid: 'role-member',
    name: 'User / Penyewa',
    code: 'member',
    description: 'Role standar pelanggan atau penyewa',
    version: 1,
    is_default: true,
  }),
];

const memberRole = defaultRoles.find((role) => role.code === 'member') as RoleRecord;
const adminRole = defaultRoles.find((role) => role.code === 'admin') as RoleRecord;
const frontOfficeRole = defaultRoles.find((role) => role.code === 'front_office') as RoleRecord;

const defaultUsers: UserRecord[] = [
  {
    uuid: 'staff-001',
    name: 'Sinta Rahmawati',
    phone_number: '+628111111111',
    location: 'Bandung',
    role: adminRole,
    user: {
      uuid: 'staff-user-001',
      email: 'sinta@rentaku.id',
      version: 1,
    },
    version: 1,
    status: 'aktif',
    membership: { uuid: 'membership-none', name: '-' },
    user_point: { uuid: 'point-staff-001', point: 0 },
  },
  {
    uuid: 'staff-002',
    name: 'Dimas Pratama',
    phone_number: '+628122222222',
    location: 'Bandung',
    role: frontOfficeRole,
    user: {
      uuid: 'staff-user-002',
      email: 'dimas@rentaku.id',
      version: 1,
    },
    version: 1,
    status: 'aktif',
    membership: { uuid: 'membership-none', name: '-' },
    user_point: { uuid: 'point-staff-002', point: 0 },
  },
  {
    uuid: 'staff-003',
    name: 'Budi Santoso',
    phone_number: '+628123334445',
    location: 'Jakarta',
    role: adminRole,
    user: {
      uuid: 'staff-user-003',
      email: 'budi.santoso@rentaku.id',
      version: 1,
    },
    version: 1,
    status: 'tidak_aktif',
    membership: { uuid: 'membership-none', name: '-' },
    user_point: { uuid: 'point-staff-003', point: 0 },
  },
  {
    uuid: 'member-001',
    name: 'Rina Kartika',
    phone_number: '+628133333333',
    birth_date: '1995-04-12',
    location: 'Bandung',
    role: memberRole,
    user: {
      uuid: 'user-member-001',
      email: 'rina.kartika@mail.com',
      version: 1,
    },
    version: 2,
    status: 'aktif',
    membership: { uuid: 'membership-gold', name: 'Gold' },
    user_point: { uuid: 'point-member-001', point: 2450 },
  },
  {
    uuid: 'member-002',
    name: 'Andi Prasetyo',
    phone_number: '+628144444444',
    birth_date: '1991-09-05',
    location: 'Jakarta',
    role: memberRole,
    user: {
      uuid: 'user-member-002',
      email: 'andi.prasetyo@mail.com',
      version: 1,
    },
    version: 1,
    status: 'aktif',
    membership: { uuid: 'membership-silver', name: 'Silver' },
    user_point: { uuid: 'point-member-002', point: 980 },
  },
  {
    uuid: 'member-003',
    name: 'Maya Lestari',
    phone_number: '+628155555555',
    birth_date: '1988-01-20',
    location: 'Surabaya',
    role: memberRole,
    user: {
      uuid: 'user-member-003',
      email: 'maya.lestari@mail.com',
      version: 1,
    },
    version: 1,
    status: 'tidak_aktif',
    membership: { uuid: 'membership-bronze', name: 'Bronze' },
    user_point: { uuid: 'point-member-003', point: 320 },
  },
];

const getRoleDb = (): RoleRecord[] => {
  return loadFromStorage<RoleRecord[]>('rentaku_roles', defaultRoles);
};

const saveRoleDb = (roles: RoleRecord[]) => {
  saveToStorage('rentaku_roles', roles);
};

const getUserDb = (): UserRecord[] => {
  return loadFromStorage<UserRecord[]>('rentaku_users', defaultUsers);
};

const saveUserDb = (users: UserRecord[]) => {
  saveToStorage('rentaku_users', users);
};

const createPagination = (page: number, perPage: number, totalData: number) => {
  const totalPage = Math.max(1, Math.ceil(totalData / perPage));
  const currentPage = Math.min(Math.max(page, 1), totalPage);

  return {
    data_per_page: perPage,
    next_page: currentPage < totalPage ? currentPage + 1 : 0,
    prev_page: currentPage > 1 ? currentPage - 1 : 0,
    first_page: 1,
    last_page: totalPage,
    next_page_url: '',
    previous_page_url: '',
    first_page_url: '',
    last_page_url: '',
    total_page: totalPage,
    total_data: totalData,
  };
};

const parsePagingParams = (queryParams: URLSearchParams) => {
  return {
    page: Number(queryParams.get('page') || '1'),
    perPage: Number(queryParams.get('per_page') || '10'),
  };
};

const paginate = <T>(items: T[], page: number, perPage: number) => {
  const start = (Math.max(page, 1) - 1) * Math.max(perPage, 1);
  const end = start + Math.max(perPage, 1);

  return {
    data: items.slice(start, end),
    pagination: createPagination(page, perPage, items.length),
  };
};

const filterBySearch = (items: UserRecord[], search: string) => {
  if (!search) return items;

  return items.filter((item) => {
    return (
      item.name.toLowerCase().includes(search) ||
      item.user.email.toLowerCase().includes(search) ||
      item.phone_number.toLowerCase().includes(search)
    );
  });
};

const filterRoles = (items: RoleRecord[], search: string) => {
  if (!search) return items;

  return items.filter((item) => {
    return (
      item.name.toLowerCase().includes(search) ||
      item.code.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });
};

const normalizeBody = (body: any) => {
  return body && typeof body === 'object' ? body : {};
};

const handleRoleMutation = (
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body: any,
): MockResult => {
  const roles = getRoleDb();

  if (path === '/auth/role' && method === 'POST') {
    const payload = normalizeBody(body);
    const nextRole: RoleRecord = createRole({
      uuid: `role-${Date.now()}`,
      name: payload.name || 'New Role',
      code: payload.code || `role_${Date.now()}`,
      description: payload.description || '',
      version: 1,
      is_default: false,
    });

    roles.push(nextRole);
    saveRoleDb(roles);
    return createSuccessResponse(nextRole, 'Role berhasil dibuat');
  }

  const editMatch = path.match(/^\/auth\/role\/([^/]+)$/u);
  const removeMatch = path.match(/^\/auth\/role\/([^/]+)\/remove$/u);

  if (editMatch && method === 'PUT') {
    const uuid = editMatch[1];
    const payload = normalizeBody(body);
    const role = roles.find((item) => item.uuid === uuid);

    if (!role) return createSuccessResponse(null, 'Role tidak ditemukan');

    role.name = payload.name || role.name;
    role.code = payload.code || role.code;
    role.description = payload.description ?? role.description;
    role.version += 1;
    role.updated = { at: new Date().toISOString(), by: 'mock-admin' };

    saveRoleDb(roles);
    return createSuccessResponse(role, 'Role berhasil diperbarui');
  }

  if (removeMatch && method === 'DELETE') {
    const uuid = removeMatch[1];
    const index = roles.findIndex((item) => item.uuid === uuid);

    if (index === -1) return createSuccessResponse(null, 'Role tidak ditemukan');

    roles.splice(index, 1);
    saveRoleDb(roles);
    return createSuccessResponse(null, 'Role berhasil dihapus');
  }

  return undefined;
};

const buildUserResponse = (record: UserRecord) => ({
  uuid: record.uuid,
  name: record.name,
  phone_number: record.phone_number,
  birth_date: record.birth_date,
  location: record.location,
  role: record.role,
  user: record.user,
  version: record.version,
  status: record.status || 'aktif',
  membership: record.membership,
  user_point: record.user_point,
});

const handleStaffMutation = (
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body: any,
): MockResult => {
  const users = getUserDb();
  const roles = getRoleDb();

  if (path === '/auth/employee/create' && method === 'POST') {
    const payload = normalizeBody(body);
    const selectedRole = roles.find((role) => role.uuid === payload.role_uuid) || adminRole;

    const nextStaff: UserRecord = {
      uuid: `staff-${Date.now()}`,
      name: payload.name || 'New Staff',
      phone_number: payload.phone_number || '',
      location: 'Bandung',
      role: selectedRole,
      user: {
        uuid: `staff-user-${Date.now()}`,
        email: payload.email || 'admin@rentaku.id',
        version: 1,
      },
      version: 1,
      status: (payload.status as 'aktif' | 'tidak_aktif') || 'aktif',
      membership: { uuid: 'membership-none', name: '-' },
      user_point: { uuid: `point-${Date.now()}`, point: 0 },
    };

    users.unshift(nextStaff);
    saveUserDb(users);
    return createSuccessResponse(nextStaff, 'Admin berhasil ditambahkan');
  }

  const editMatch = path.match(/^\/auth\/employee\/([^/]+)\/edit$/u);
  const removeMatch = path.match(/^\/auth\/employee\/([^/]+)\/remove$/u);
  const detailMatch = path.match(/^\/auth\/employee\/([^/]+)$/u);

  if (editMatch && method === 'PUT') {
    const uuid = editMatch[1];
    const payload = normalizeBody(body);
    const staff = users.find((item) => item.uuid === uuid);

    if (!staff) return createSuccessResponse(null, 'Admin tidak ditemukan');

    staff.name = payload.name || staff.name;
    staff.phone_number = payload.phone_number || staff.phone_number;
    if (payload.role_uuid) {
      staff.role = roles.find((role) => role.uuid === payload.role_uuid) || staff.role;
    }
    if (payload.status) {
      staff.status = payload.status;
    }
    if (payload.user?.email || payload.email) {
      staff.user.email = payload.user?.email || payload.email || staff.user.email;
      staff.user.version = (staff.user.version || 1) + 1;
    }
    staff.version += 1;

    saveUserDb(users);
    return createSuccessResponse(buildUserResponse(staff), 'Admin berhasil diperbarui');
  }

  if (removeMatch && method === 'DELETE') {
    const uuid = removeMatch[1];
    const index = users.findIndex((item) => item.uuid === uuid);

    if (index === -1) return createSuccessResponse(null, 'Admin tidak ditemukan');

    users.splice(index, 1);
    saveUserDb(users);
    return createSuccessResponse(null, 'Admin berhasil dihapus');
  }

  if (detailMatch && method === 'GET') {
    const uuid = detailMatch[1];
    const staff = users.find((item) => item.uuid === uuid);

    return createSuccessResponse(staff ? buildUserResponse(staff) : null);
  }

  return undefined;
};

const handleMemberMutation = (
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body: any,
): MockResult => {
  const users = getUserDb();
  const roles = getRoleDb();

  if (path === '/auth/member' && method === 'POST') {
    const payload = normalizeBody(body);
    const selectedRole = roles.find((role) => role.uuid === payload.role_uuid) || memberRole;

    const nextMember: UserRecord = {
      uuid: `member-${Date.now()}`,
      name: payload.name || 'New Member',
      phone_number: payload.phone_number || '',
      birth_date: payload.birth_date || '1995-01-01',
      location: payload.location || 'Bandung',
      role: selectedRole,
      user: {
        uuid: `member-user-${Date.now()}`,
        email: payload.email || 'user@rentaku.id',
        version: 1,
      },
      version: 1,
      status: (payload.status as 'aktif' | 'tidak_aktif') || 'aktif',
      membership: { uuid: 'membership-bronze', name: 'Bronze' },
      user_point: { uuid: `point-${Date.now()}`, point: 0 },
    };

    users.unshift(nextMember);
    saveUserDb(users);
    return createSuccessResponse(nextMember, 'User berhasil ditambahkan');
  }

  const editMatch = path.match(/^\/auth\/member\/([^/]+)\/edit$/u);
  const removeMatch = path.match(/^\/auth\/member\/([^/]+)\/remove$/u);
  const detailMatch = path.match(/^\/auth\/member\/([^/]+)$/u);

  if (editMatch && method === 'PUT') {
    const uuid = editMatch[1];
    const payload = normalizeBody(body);
    const member = users.find((item) => item.uuid === uuid);

    if (!member) return createSuccessResponse(null, 'User tidak ditemukan');

    member.name = payload.name || member.name;
    member.phone_number = payload.phone_number || member.phone_number;
    member.birth_date = payload.birth_date || member.birth_date;
    member.location = payload.location || member.location;
    if (payload.role_uuid) {
      member.role = roles.find((role) => role.uuid === payload.role_uuid) || member.role;
    }
    if (payload.status) {
      member.status = payload.status;
    }
    if (payload.user?.email || payload.email) {
      member.user.email = payload.user?.email || payload.email || member.user.email;
      member.user.version = (member.user.version || 1) + 1;
    }
    member.version += 1;

    saveUserDb(users);
    return createSuccessResponse(buildUserResponse(member), 'User berhasil diperbarui');
  }

  if (removeMatch && method === 'DELETE') {
    const uuid = removeMatch[1];
    const index = users.findIndex((item) => item.uuid === uuid);

    if (index === -1) return createSuccessResponse(null, 'User tidak ditemukan');

    users.splice(index, 1);
    saveUserDb(users);
    return createSuccessResponse(null, 'User berhasil dihapus');
  }

  if (detailMatch && method === 'GET') {
    const uuid = detailMatch[1];
    const member = users.find((item) => item.uuid === uuid);

    return createSuccessResponse(member ? buildUserResponse(member) : null);
  }

  return undefined;
};

export const handleUserManagementMock = ({
  path,
  queryParams,
  method,
  data,
}: MockRequestContext): MockResult => {
  if (path === '/auth/role' && method === 'GET') {
    const roles = getRoleDb();
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const filtered = filterRoles(roles, search);
    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const roleDetailMatch = path.match(/^\/auth\/role\/([^/]+)$/u);

  if (roleDetailMatch && method === 'GET') {
    const roles = getRoleDb();
    const role = roles.find((item) => item.uuid === roleDetailMatch[1]);

    return createSuccessResponse(role || null);
  }

  const roleMutation = handleRoleMutation(path, method as 'GET' | 'POST' | 'PUT' | 'DELETE', data);

  if (typeof roleMutation !== 'undefined') {
    return roleMutation;
  }

  if (path === '/auth/employee' && method === 'GET') {
    const users = getUserDb();
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const roleUuid = queryParams.get('role_uuid') || '';
    const status = queryParams.get('status') || '';

    let filtered = users.filter((item) => item.role.code !== 'member');

    if (roleUuid) {
      filtered = filtered.filter((item) => item.role.uuid === roleUuid);
    }
    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }
    filtered = filterBySearch(filtered, search);

    const result = paginate(filtered.map(buildUserResponse), page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const staffMutation = handleStaffMutation(
    path,
    method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    data,
  );

  if (typeof staffMutation !== 'undefined') {
    return staffMutation;
  }

  if (path === '/auth/member' && method === 'GET') {
    const users = getUserDb();
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const status = queryParams.get('status') || '';

    let filtered = users.filter((item) => item.role.code === 'member');

    if (status) {
      filtered = filtered.filter((item) => item.status === status);
    }
    filtered = filterBySearch(filtered, search);

    const result = paginate(filtered.map(buildUserResponse), page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const memberMutation = handleMemberMutation(
    path,
    method as 'GET' | 'POST' | 'PUT' | 'DELETE',
    data,
  );

  if (typeof memberMutation !== 'undefined') {
    return memberMutation;
  }

  return undefined;
};
