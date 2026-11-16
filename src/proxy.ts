import { type NextRequest, NextResponse } from 'next/server';

import { upperFirst } from 'lodash';

import PROTECTED_ROUTES from './constant/protectedRoutes';
import { PermissionType } from './lib/types/permission.type';
import { decryptData } from './lib/utils/encrypt';
import { deleteSplitCookie, getSplitCookie } from './lib/utils/getSplitCookie';

const matchRoute = (currentPathname: string) => {
  return PROTECTED_ROUTES.find((route) => {
    // Replace dynamic segments like ':uuid' with a regex pattern to match alphanumeric strings
    const regexPattern = route.pathname
      .replace(/:[a-zA-Z]+/gu, '[a-zA-Z0-9-]+') // Replace :param with a regex for alphanumeric or hyphen
      .replace(/\*/gu, '.*'); // Replace wildcards (*) with '.*' to match any characters

    const routeRegex = new RegExp(`^${regexPattern}$`, 'u');

    return routeRegex.test(currentPathname);
  });
};

// eslint-disable-next-line consistent-return -- middleware
export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('rk_token')?.value;

  const permissionsData = getSplitCookie(request.cookies, 'permissions');
  const decryptedPermissions = permissionsData ? decryptData(permissionsData) : [];
  let permissions: PermissionType[] | null = [];

  if (Array.isArray(decryptedPermissions)) {
    permissions = decryptedPermissions as PermissionType[];
  } else if (decryptedPermissions === null) {
    permissions = null;
  }

  // regex for path ended with .png | .svg | .jpg | .jpeg
  // eslint-disable-next-line regexp/no-unused-capturing-group
  if (/\/([^/]+\.(png|svg|jpeg|jpg|mp3|xlsx))$/u.test(pathname)) {
    return NextResponse.next();
  }

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard/admin', request.url));
  }

  if ((pathname === '/' || pathname.startsWith('/dashboard')) && !token) {
    return NextResponse.redirect(new URL(`/login?fallback=${pathname}`, request.url));
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard/admin', request.url));
  }

  const matchedRoute = matchRoute(pathname);

  if (permissions && matchedRoute) {
    const mod = permissions.find(
      (module) =>
        module.module_name.toLocaleLowerCase().replaceAll(' ', '_') ===
        matchedRoute.permission_module,
    );

    if (mod?.accesses?.some((d) => d[upperFirst(matchedRoute.permission_action)]) === false) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  if (permissionsData && permissions === null) {
    const response = NextResponse.redirect(new URL('/login', request.url));

    deleteSplitCookie(response.cookies, 'permissions');
    return response;
  }
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  unstable_allowDynamic: ['**/node_modules/lodash/**', '**/node_modules/function-bind/**'],
};
