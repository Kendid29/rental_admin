import { handleAgentMock } from './agent.mock';
import { handleAuthMock } from './auth.mock';
import { handleBookingMock } from './booking.mock';
import { createSuccessResponse, parseQueryParams } from './common';
import { HttpMethod } from './types';
import { handleUserManagementMock } from './user-management.mock';

export const handleMockRequest = (url: string, method: HttpMethod, data?: any) => {
  const path = url.split('?')[0];
  const queryParams = parseQueryParams(url);

  const context = {
    path,
    queryParams,
    method,
    data,
  };

  const authResult = handleAuthMock(context);

  if (typeof authResult !== 'undefined') {
    return authResult;
  }

  const bookingResult = handleBookingMock(context);

  if (typeof bookingResult !== 'undefined') {
    return bookingResult;
  }

  const userManagementResult = handleUserManagementMock(context);

  if (typeof userManagementResult !== 'undefined') {
    return userManagementResult;
  }

  const agentResult = handleAgentMock(context);

  if (typeof agentResult !== 'undefined') {
    return agentResult;
  }

  if (method === 'GET') {
    return createSuccessResponse([]);
  }

  return createSuccessResponse(data ?? null);
};
