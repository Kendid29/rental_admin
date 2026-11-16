import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';

const createFullAccessPermissions = () => {
    const modules = [
        'dashboard',
        'employee',
        'user',
        'role',
        'role_permission',
        'membership',
        'booking',
        'facility',
        'room_on_request_facility',
        'room_category',
        'room_type',
        'addon',
        'room_pricing',
        'package_tour',
        'package_tour_pricing',
        'dining',
        'meeting_room',
        'layout',
        'promo',
        'promo_category',
        'voucher',
        'voucher_category',
        'report',
    ];

    return modules.map((module_name) => ({
        module_name,
        accesses: [{ Read: true }, { Create: true }, { Update: true }, { Delete: true }],
    }));
};

const createPermissionCatalog = () => {
    const modules = [
        'dashboard',
        'employee',
        'user',
        'role',
        'role_permission',
        'membership',
        'booking',
        'facility',
        'room_on_request_facility',
        'room_category',
        'room_type',
        'addon',
        'room_pricing',
        'package_tour',
        'package_tour_pricing',
        'dining',
        'meeting_room',
        'layout',
        'promo',
        'promo_category',
        'voucher',
        'voucher_category',
        'report',
    ];

    const permissions = ['Read', 'Create', 'Update', 'Delete'];

    return modules.flatMap((module_name) => {
        const module_key = module_name;

        return permissions.map((permission_name) => ({
            uuid: `${module_key}-${permission_name.toLowerCase()}`,
            module_key,
            module_name,
            permission_name,
        }));
    });
};

export const handleAuthMock = ({ path, method }: MockRequestContext): MockResult => {
    if (path === '/auth/login' && method === 'POST') {
        return createSuccessResponse(
            {
                token: 'mock-admin-token',
            },
            'Login Successfully',
        );
    }

    if (path === '/auth/user-session' && method === 'GET') {
        return createSuccessResponse({
            user: {
                uuid: 'mock-user-uuid',
                email: 'admin@lanadiya.local',
                version: 1,
            },
            profile: {
                uuid: 'mock-profile-uuid',
                name: 'Admin Lanadiya',
                photo: {
                    uuid: 'mock-photo-uuid',
                    url: '/img/grandia_logo.svg',
                },
            },
            permissions: createFullAccessPermissions(),
        });
    }

    if (path === '/auth/role-permission/detail' && method === 'GET') {
        return createSuccessResponse(createFullAccessPermissions());
    }

    if (path === '/auth/permission' && method === 'GET') {
        return createSuccessResponse(createPermissionCatalog());
    }

    if (path === '/auth/role-permission' && method === 'PUT') {
        return createSuccessResponse(null, 'Permission updated successfully');
    }

    if (path === '/auth/logout' && method === 'POST') {
        return createSuccessResponse(null, 'Logout Successfully');
    }

    return undefined;
};
