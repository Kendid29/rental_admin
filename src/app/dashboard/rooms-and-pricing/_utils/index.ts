import { Dayjs } from 'dayjs';

import { RoomTypeType } from '@/lib/types/room-type.type';

/**
 * Get active day by repeat on
 * @param {string} repeat_on The repeat on value
 * @param {Dayjs} date The date to check
 * @returns {boolean} True if the date is active, false otherwise
 */
export const getActiveDayByRepeatOn = (repeat_on: string, date: Dayjs): boolean => {
  if (repeat_on === 'all_days') {
    return true;
  }

  const dayOfWeek = date.day();

  if (repeat_on === 'weekends') {
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      // Friday and Saturday
      return true;
    }

    return false;
  }

  if (repeat_on === 'weekdays') {
    if (
      dayOfWeek === 0 ||
      dayOfWeek === 1 ||
      dayOfWeek === 2 ||
      dayOfWeek === 3 ||
      dayOfWeek === 4 // Sunday to Thursday
    ) {
      return true;
    }

    return false;
  }

  return false;
};

export const groupRoomTypesByVilla = (roomTypes: RoomTypeType[] = []) => {
  return roomTypes.reduce<Record<string, RoomTypeType[]>>((acc, roomType) => {
    const villaUuid = roomType.villa?.uuid || roomType.room_category?.uuid || '';

    if (!villaUuid) {
      return acc;
    }

    if (!acc[villaUuid]) {
      acc[villaUuid] = [];
    }

    acc[villaUuid].push(roomType);

    return acc;
  }, {});
};
