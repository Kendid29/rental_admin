import { createSuccessResponse, parseQueryParams } from './common';
import { handleAgentMock } from './agent.mock';
import { handleAuthMock } from './auth.mock';
import { handleBookingMock } from './booking.mock';
import { handleDashboardMock } from './dashboard.mock';
import { handleMembershipMock } from './membership.mock';
import { handlePackageTourMock } from './package-tour.mock';
import { handleReportsMock } from './reports.mock';
import { handleRoomAddonMock } from './room-addon.mock';
import { handleVillaClassMock } from './villa-class.mock';
import { handleRoomFacilitiesMock } from './room-facilities.mock';
import { handleRoomOnRequestFacilitiesMock } from './room-on-request-facilities.mock';
import { handleRoomPricingMock } from './room-pricing.mock';
import { handleRoomTypeMock } from './room-type.mock';
import { handleUserManagementMock } from './user-management.mock';
import { handlePromotionMock } from './promotion.mock';
import { handleVoucherMock } from './voucher.mock';
import { handleActivityMock } from './activity.mock';
import { HttpMethod } from './types';

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

  const dashboardResult = handleDashboardMock(context);
  if (typeof dashboardResult !== 'undefined') {
    return dashboardResult;
  }

  const bookingResult = handleBookingMock(context);
  if (typeof bookingResult !== 'undefined') {
    return bookingResult;
  }

  const reportsResult = handleReportsMock(context);
  if (typeof reportsResult !== 'undefined') {
    return reportsResult;
  }

  const userManagementResult = handleUserManagementMock(context);
  if (typeof userManagementResult !== 'undefined') {
    return userManagementResult;
  }

  const membershipResult = handleMembershipMock(context);
  if (typeof membershipResult !== 'undefined') {
    return membershipResult;
  }

  const agentResult = handleAgentMock(context);
  if (typeof agentResult !== 'undefined') {
    return agentResult;
  }

  const roomFacilitiesResult = handleRoomFacilitiesMock(context);
  if (typeof roomFacilitiesResult !== 'undefined') {
    return roomFacilitiesResult;
  }

  const roomOnRequestFacilitiesResult = handleRoomOnRequestFacilitiesMock(context);
  if (typeof roomOnRequestFacilitiesResult !== 'undefined') {
    return roomOnRequestFacilitiesResult;
  }

  const villaClassResult = handleVillaClassMock(context);
  if (typeof villaClassResult !== 'undefined') {
    return villaClassResult;
  }

  const roomTypeResult = handleRoomTypeMock(context);
  if (typeof roomTypeResult !== 'undefined') {
    return roomTypeResult;
  }

  const roomAddonResult = handleRoomAddonMock(context);
  if (typeof roomAddonResult !== 'undefined') {
    return roomAddonResult;
  }

  const roomPricingResult = handleRoomPricingMock(context);
  if (typeof roomPricingResult !== 'undefined') {
    return roomPricingResult;
  }

  const packageTourResult = handlePackageTourMock(context);
  if (typeof packageTourResult !== 'undefined') {
    return packageTourResult;
  }

  const promotionResult = handlePromotionMock(context);
  if (typeof promotionResult !== 'undefined') {
    return promotionResult;
  }

  const voucherResult = handleVoucherMock(context);
  if (typeof voucherResult !== 'undefined') {
    return voucherResult;
  }

  const activityResult = handleActivityMock(context);
  if (typeof activityResult !== 'undefined') {
    return activityResult;
  }

  if (method === 'GET') {
    return createSuccessResponse([]);
  }

  return createSuccessResponse(data ?? null);
};
