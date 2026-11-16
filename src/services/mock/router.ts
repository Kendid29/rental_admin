import { handleAgentMock } from './agent.mock';
import { handleAuthMock } from './auth.mock';
import { handleBookingMock } from './booking.mock';
import { createSuccessResponse, parseQueryParams } from './common';
import { handleReimburseMock } from './reimburse.mock';
import { HttpMethod } from './types';
import { handleUserManagementMock } from './user-management.mock';
import { handleVehicleCategoryMock } from './vehicle-category.mock';

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

  const vehicleCategoryResult = handleVehicleCategoryMock(context);

  if (typeof vehicleCategoryResult !== 'undefined') {
    return vehicleCategoryResult;
  }

  const reimburseResult = handleReimburseMock(context);

  if (typeof reimburseResult !== 'undefined') {
    return reimburseResult;
  }

  if (method === 'GET') {
    return createSuccessResponse([]);
  }

  return createSuccessResponse(data ?? null);
};
