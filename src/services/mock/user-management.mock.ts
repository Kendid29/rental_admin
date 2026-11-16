import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';

interface RoleRecord {
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

interface UserRecord {
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

const roleDb: RoleRecord[] = [
  createRole({
    uuid: 'role-master-admin',
    name: 'Master Admin',
    code: 'master_admin',
    description: 'Full access to all modules',
    version: 1,
    is_default: true,
  }),
  createRole({
    uuid: 'role-admin',
    name: 'Admin',
    code: 'admin',
    description: 'Operational staff with broad access',
    version: 1,
    is_default: false,
  }),
  createRole({
    uuid: 'role-front-office',
    name: 'Front Office',
    code: 'front_office',
    description: 'Front office and reservation handling',
    version: 1,
    is_default: false,
  }),
  createRole({
    uuid: 'role-member',
    name: 'Member',
    code: 'member',
    description: 'Customer membership role',
    version: 1,
    is_default: true,
  }),
];

const memberRole = roleDb.find((role) => role.code === 'member') as RoleRecord;
const adminRole = roleDb.find((role) => role.code === 'admin') as RoleRecord;
const frontOfficeRole = roleDb.find((role) => role.code === 'front_office') as RoleRecord;

const userDb: UserRecord[] = [
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
    membership: { uuid: 'membership-none', name: '-' },
    user_point: { uuid: 'point-staff-002', point: 0 },
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
    membership: { uuid: 'membership-bronze', name: 'Bronze' },
    user_point: { uuid: 'point-member-003', point: 320 },
  },
];

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

const findByUuid = (uuid: string) => {
  return userDb.find((item) => item.uuid === uuid);
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

    roleDb.push(nextRole);
    return createSuccessResponse(nextRole, 'Role created successfully');
  }

  const editMatch = path.match(/^\/auth\/role\/([^/]+)$/u);
  const removeMatch = path.match(/^\/auth\/role\/([^/]+)\/remove$/u);

  if (editMatch && method === 'PUT') {
    const uuid = editMatch[1];
    const payload = normalizeBody(body);
    const role = roleDb.find((item) => item.uuid === uuid);

    if (!role) return createSuccessResponse(null, 'Role not found');

    role.name = payload.name || role.name;
    role.code = payload.code || role.code;
    role.description = payload.description ?? role.description;
    role.version += 1;
    role.updated = { at: new Date().toISOString(), by: 'mock-admin' };

    return createSuccessResponse(role, 'Role updated successfully');
  }

  if (removeMatch && method === 'DELETE') {
    const uuid = removeMatch[1];
    const index = roleDb.findIndex((item) => item.uuid === uuid);
    if (index === -1) return createSuccessResponse(null, 'Role not found');

    roleDb.splice(index, 1);
    return createSuccessResponse(null, 'Role deleted successfully');
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
  membership: record.membership,
  user_point: record.user_point,
});

const handleStaffMutation = (
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body: any,
): MockResult => {
  if (path === '/auth/employee/create' && method === 'POST') {
    const payload = normalizeBody(body);
    const selectedRole = roleDb.find((role) => role.uuid === payload.role_uuid) || adminRole;

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
      membership: { uuid: 'membership-none', name: '-' },
      user_point: { uuid: `point-${Date.now()}`, point: 0 },
    };

    userDb.unshift(nextStaff);
    return createSuccessResponse(nextStaff, 'Staff created successfully');
  }

  const editMatch = path.match(/^\/auth\/employee\/([^/]+)\/edit$/u);
  const removeMatch = path.match(/^\/auth\/employee\/([^/]+)\/remove$/u);
  const detailMatch = path.match(/^\/auth\/employee\/([^/]+)$/u);

  if (editMatch && method === 'PUT') {
    const uuid = editMatch[1];
    const payload = normalizeBody(body);
    const staff = findByUuid(uuid);
    if (!staff) return createSuccessResponse(null, 'Staff not found');

    staff.name = payload.name || staff.name;
    staff.phone_number = payload.phone_number || staff.phone_number;
    staff.role = roleDb.find((role) => role.uuid === payload.role_uuid) || staff.role;
    staff.user.email = payload.user?.email || staff.user.email;
    staff.user.version = (payload.user?.version || staff.user.version) + 1;
    staff.version += 1;

    return createSuccessResponse(buildUserResponse(staff), 'Staff updated successfully');
  }

  if (removeMatch && method === 'DELETE') {
    const uuid = removeMatch[1];
    const index = userDb.findIndex((item) => item.uuid === uuid);
    if (index === -1) return createSuccessResponse(null, 'Staff not found');

    userDb.splice(index, 1);
    return createSuccessResponse(null, 'Staff deleted successfully');
  }

  if (detailMatch && method === 'GET') {
    const uuid = detailMatch[1];
    const staff = findByUuid(uuid);
    return createSuccessResponse(staff ? buildUserResponse(staff) : null);
  }

  return undefined;
};

const handleMemberMutation = (
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body: any,
): MockResult => {
  if (path === '/auth/member' && method === 'POST') {
    const payload = normalizeBody(body);
    const selectedRole = roleDb.find((role) => role.uuid === payload.role_uuid) || memberRole;

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
      membership: { uuid: 'membership-bronze', name: 'Bronze' },
      user_point: { uuid: `point-${Date.now()}`, point: 0 },
    };

    userDb.unshift(nextMember);
    return createSuccessResponse(nextMember, 'Member created successfully');
  }

  const editMatch = path.match(/^\/auth\/member\/([^/]+)\/edit$/u);
  const removeMatch = path.match(/^\/auth\/member\/([^/]+)\/remove$/u);
  const detailMatch = path.match(/^\/auth\/member\/([^/]+)$/u);

  if (editMatch && method === 'PUT') {
    const uuid = editMatch[1];
    const payload = normalizeBody(body);
    const member = findByUuid(uuid);
    if (!member) return createSuccessResponse(null, 'Member not found');

    member.name = payload.name || member.name;
    member.phone_number = payload.phone_number || member.phone_number;
    member.birth_date = payload.birth_date || member.birth_date;
    member.location = payload.location || member.location;
    member.role = roleDb.find((role) => role.uuid === payload.role_uuid) || member.role;
    member.user.email = payload.user?.email || member.user.email;
    member.user.version = (payload.user?.version || member.user.version) + 1;
    member.version += 1;

    return createSuccessResponse(buildUserResponse(member), 'Member updated successfully');
  }

  if (removeMatch && method === 'DELETE') {
    const uuid = removeMatch[1];
    const index = userDb.findIndex((item) => item.uuid === uuid);
    if (index === -1) return createSuccessResponse(null, 'Member not found');

    userDb.splice(index, 1);
    return createSuccessResponse(null, 'Member deleted successfully');
  }

  if (detailMatch && method === 'GET') {
    const uuid = detailMatch[1];
    const member = findByUuid(uuid);
    return createSuccessResponse(member ? buildUserResponse(member) : null);
  }

  return undefined;
};

export const handleUserManagementMock = ({ path, queryParams, method, data }: MockRequestContext): MockResult => {
  if (path === '/auth/role' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const filtered = filterRoles(roleDb, search);
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
    const role = roleDb.find((item) => item.uuid === roleDetailMatch[1]);
    return createSuccessResponse(role || null);
  }

  const roleMutation = handleRoleMutation(path, method as 'GET' | 'POST' | 'PUT' | 'DELETE', data);
  if (typeof roleMutation !== 'undefined') {
    return roleMutation;
  }

  if (path === '/auth/employee' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const roleUuid = queryParams.get('role_uuid') || '';
    const filtered = filterBySearch(
      userDb.filter((item) => (roleUuid ? item.role.uuid === roleUuid : true) && item.role.code !== 'member'),
      search,
    );
    const result = paginate(filtered.map(buildUserResponse), page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const staffMutation = handleStaffMutation(path, method as 'GET' | 'POST' | 'PUT' | 'DELETE', data);
  if (typeof staffMutation !== 'undefined') {
    return staffMutation;
  }

  if (path === '/auth/member' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const filtered = filterBySearch(
      userDb.filter((item) => item.role.code === 'member'),
      search,
    );
    const result = paginate(filtered.map(buildUserResponse), page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const memberMutation = handleMemberMutation(path, method as 'GET' | 'POST' | 'PUT' | 'DELETE', data);
  if (typeof memberMutation !== 'undefined') {
    return memberMutation;
  }

  return undefined;
};
