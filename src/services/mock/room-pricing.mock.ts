import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';
import { RoomsAndPricingType, RoomsAndPricingCalendarDateType } from '@/lib/types/rooms-and-pricing.type';

const roomPricingDb: RoomsAndPricingType[] = [
  {
    uuid: 'rp-villa-001',
    date: '2026-04-22',
    selling_price: 5000000,
    agent_price: 4500000,
    base_price: 6000000,
    quantity: 1,
    is_high_recommendation: true,
    is_low_recommendation: false,
    created: { at: '2026-04-22 10:00:00', by: 'System' },
    updated: { at: '2026-04-22 10:00:00', by: 'System' },
    facilities_count: 5,
    room_type: { uuid: 'rt-101', name: 'Room 1' },
    max_adult: 6,
    max_child: 3,
    room_quantity: 3,
    feature_highlight: {
      is_breakfast: true,
      occupancy: 6,
      bed_type: 'King',
      total_bed: 3,
    },
    photo: {} as any,
    facilities: [],
    villa_class: { uuid: 'villa-001', name: 'Villa 1' },
    villa_class_uuid: 'villa-001',
    villa_base_price: 6000000,
    villa_selling_price: 5000000,
    villa_agent_price: 4500000,
    villa_max_adult: 6,
    villa_max_child: 3,
    rooms: [
      {
        room_type: { uuid: 'rt-101', name: 'Room 1' },
        base_price: 1800000,
        selling_price: 1500000,
        agent_price: 1300000,
        max_adult: 2,
        max_child: 1,
      },
      {
        room_type: { uuid: 'rt-102', name: 'Room 2' },
        base_price: 1600000,
        selling_price: 1400000,
        agent_price: 1200000,
        max_adult: 2,
        max_child: 1,
      },
      {
        room_type: { uuid: 'rt-103', name: 'Room 3' },
        base_price: 1700000,
        selling_price: 1450000,
        agent_price: 1250000,
        max_adult: 2,
        max_child: 1,
      },
    ],
    addons: [
      {
        uuid: 'rpa-001',
        addon: {
          uuid: 'ra-001',
          name: 'Extra Breakfast',
          description: 'Additional breakfast buffet',
        },
        price_tiers: [
          { from_quantity: 1, to_quantity: 5, price: 100000, agent_price: 85000 },
          { from_quantity: 6, to_quantity: 10, price: 90000, agent_price: 75000 },
        ],
        version: 1,
      },
    ],
    is_rescheduleable: true,
    is_cancellable: false,
    is_published: true,
    version: 1,
  },
  {
    uuid: 'rp-villa-002',
    date: '2026-04-22',
    selling_price: 3500000,
    agent_price: 3200000,
    base_price: 4000000,
    quantity: 1,
    is_high_recommendation: false,
    is_low_recommendation: false,
    created: { at: '2026-04-22 10:00:00', by: 'System' },
    updated: { at: '2026-04-22 10:00:00', by: 'System' },
    facilities_count: 3,
    room_type: { uuid: 'rt-201', name: 'Room 1' },
    max_adult: 6,
    max_child: 3,
    room_quantity: 3,
    feature_highlight: {
      is_breakfast: false,
      occupancy: 6,
      bed_type: 'Twin',
      total_bed: 3,
    },
    photo: {} as any,
    facilities: [],
    villa_class: { uuid: 'villa-002', name: 'Villa 2' },
    villa_class_uuid: 'villa-002',
    villa_base_price: 4000000,
    villa_selling_price: 3500000,
    villa_agent_price: 3200000,
    villa_max_adult: 6,
    villa_max_child: 3,
    rooms: [
      {
        room_type: { uuid: 'rt-201', name: 'Room 1' },
        base_price: 900000,
        selling_price: 850000,
        agent_price: 750000,
        max_adult: 2,
        max_child: 1,
      },
      {
        room_type: { uuid: 'rt-202', name: 'Room 2' },
        base_price: 850000,
        selling_price: 800000,
        agent_price: 700000,
        max_adult: 2,
        max_child: 1,
      },
      {
        room_type: { uuid: 'rt-203', name: 'Room 3' },
        base_price: 950000,
        selling_price: 900000,
        agent_price: 780000,
        max_adult: 2,
        max_child: 1,
      },
    ],
    addons: [],
    is_rescheduleable: true,
    is_cancellable: true,
    is_published: true,
    version: 1,
  },
];

const calendarDb: RoomsAndPricingCalendarDateType[] = [
  { date: '2026-04-22', total_room_pricing: 2 },
  { date: '2026-04-23', total_room_pricing: 1 },
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

const filterRoomPricing = (search: string, date: string) => {
  let filtered = roomPricingDb;

  if (date) {
    filtered = filtered.filter((item) => item.date === date);
  }

  if (search) {
    filtered = filtered.filter((item) => {
      return (
        item.room_type?.name?.toLowerCase().includes(search) ||
        item.villa_class?.name?.toLowerCase().includes(search) ||
        item.villa_class_uuid?.toLowerCase().includes(search)
      );
    });
  }

  return filtered;
};

const normalizeRoomPricingPayload = (body: any) => {
  const villaClassUuid = body?.villa_class_uuid || body?.villaClassUuid || '';
  const rooms = Array.isArray(body?.rooms) ? body.rooms : [];

  return {
    villaClassUuid,
    rooms,
    villaBasePrice: Number(body?.base_price || 0),
    villaSellingPrice: Number(body?.selling_price || 0),
    villaAgentPrice: Number(body?.agent_price || 0),
    villaMaxAdult: Number(body?.max_adult || 0),
    villaMaxChild: Number(body?.max_child || 0),
    dates: Array.isArray(body?.dates) ? body.dates : [],
    addons: Array.isArray(body?.addons) ? body.addons : [],
    isBreakfast: !!body?.is_breakfast,
    isCancellable: !!body?.is_cancellable,
    isRescheduleable: !!body?.is_rescheduleable,
    isPublished: !!body?.is_published,
    version: Number(body?.version || 1),
  };
};

const buildRoomPricingRecord = (
  villaClassUuid: string,
  room: any,
  index: number,
  payload: ReturnType<typeof normalizeRoomPricingPayload>,
): RoomsAndPricingType => {
  const roomTypeUuid = room?.room_type_uuid || room?.roomTypeUuid || room?.uuid || `room-${index + 1}`;
  const roomTypeName = room?.room_type?.name || room?.roomTypeName || `Room ${index + 1}`;
  const villaName = villaClassUuid === 'villa-001' ? 'Villa 1' : villaClassUuid === 'villa-002' ? 'Villa 2' : 'Villa 3';

  return {
    uuid: `rp-${villaClassUuid}`,
    date: payload.dates[0]?.date || '2026-04-22',
    selling_price: Number(room?.selling_price ?? payload.villaSellingPrice),
    agent_price: Number(room?.agent_price ?? payload.villaAgentPrice),
    base_price: Number(room?.base_price ?? payload.villaBasePrice),
    quantity: 1,
    is_high_recommendation: false,
    is_low_recommendation: false,
    created: { at: '2026-04-22 10:00:00', by: 'System' },
    updated: { at: '2026-04-22 10:00:00', by: 'System' },
    facilities_count: 0,
    room_type: { uuid: roomTypeUuid, name: roomTypeName },
    max_adult: Number(room?.max_adult || 1),
    max_child: Number(room?.max_child || 0),
    room_quantity: payload.rooms.length || 1,
    feature_highlight: {
      is_breakfast: payload.isBreakfast,
      occupancy: Number(payload.villaMaxAdult || room?.max_adult || 1),
      bed_type: room?.bed_type || 'King',
      total_bed: payload.rooms.length || 1,
    },
    photo: {} as any,
    facilities: [],
    villa_class: { uuid: villaClassUuid, name: villaName },
    villa_class_uuid: villaClassUuid,
    villa_base_price: payload.villaBasePrice,
    villa_selling_price: payload.villaSellingPrice,
    villa_agent_price: payload.villaAgentPrice,
    villa_max_adult: payload.villaMaxAdult,
    villa_max_child: payload.villaMaxChild,
    rooms: payload.rooms.map((item: any, roomIndex: number) => ({
      room_type: {
        uuid: item?.room_type_uuid || item?.roomTypeUuid || `room-${roomIndex + 1}`,
        name: item?.room_type?.name || item?.roomTypeName || `Room ${roomIndex + 1}`,
      },
      base_price: Number(item?.base_price || 0),
      selling_price: Number(item?.selling_price || 0),
      agent_price: Number(item?.agent_price || 0),
      max_adult: Number(item?.max_adult || 1),
      max_child: Number(item?.max_child || 0),
    })),
    addons: payload.addons,
    is_rescheduleable: payload.isRescheduleable,
    is_cancellable: payload.isCancellable,
    is_published: payload.isPublished,
    version: payload.version,
  };
};

export const handleRoomPricingMock = ({ path, queryParams, method, data }: MockRequestContext): MockResult => {
  if (path === '/room/pricing/create' && method === 'POST') {
    const payload = normalizeRoomPricingPayload(data);
    const nextRecords = [buildRoomPricingRecord(payload.villaClassUuid || 'villa-001', payload.rooms[0] || {}, 0, payload)];

    roomPricingDb.unshift(...nextRecords);

    return createSuccessResponse(nextRecords[0] || null, 'Room and pricing created successfully');
  }

  if (path === '/room/pricing/calendar-filter' && method === 'GET') {
    return createSuccessResponse(calendarDb);
  }

  if (path === '/room/pricing' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const date = queryParams.get('date') || '';
    const checkIn = queryParams.get('check_in') || '';
    const checkOut = queryParams.get('check_out') || '';

    let filtered = roomPricingDb;

    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const tempRecords: RoomsAndPricingType[] = [];

      // Get unique base records per room type to clone
      const baseRecords = roomPricingDb.filter(
        (item, idx, self) =>
          self.findIndex((t) => t.room_type?.uuid === item.room_type?.uuid) === idx,
      );

      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const currentStr = d.toISOString().split('T')[0];
        for (const base of baseRecords) {
          tempRecords.push({
            ...base,
            uuid: `${base.uuid}-${currentStr}`,
            date: currentStr,
          });
        }
      }
      filtered = tempRecords;
    } else {
      filtered = filterRoomPricing(search, date);
    }

    if (search) {
      filtered = filtered.filter((item) => {
        return (
          item.room_type.name.toLowerCase().includes(search) ||
          item.villa_class?.name?.toLowerCase().includes(search) ||
          item.villa_class_uuid?.toLowerCase().includes(search)
        );
      });
    }

    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const detailMatch = path.match(/^\/room\/pricing\/([^/]+)\/detail$/u);
  if (detailMatch && method === 'GET') {
    const pricing = roomPricingDb.find((item) => item.uuid === detailMatch[1]);
    return createSuccessResponse(pricing || null);
  }

  const editMatch = path.match(/^\/room\/pricing\/([^/]+)\/edit$/u);
  if (editMatch && method === 'PUT') {
    const uuid = editMatch[1];
    const index = roomPricingDb.findIndex((item) => item.uuid === uuid);

    if (index === -1) {
      return createSuccessResponse(null, 'Room and pricing not found');
    }

    const payload = normalizeRoomPricingPayload(data);
    const existing = roomPricingDb[index];
    const updated = buildRoomPricingRecord(payload.villaClassUuid || existing.villa_class_uuid || 'villa-001', payload.rooms[0] || {}, 0, payload);

    roomPricingDb[index] = {
      ...existing,
      ...updated,
      uuid: existing.uuid,
      version: existing.version + 1,
      updated: { at: '2026-04-22 10:00:00', by: 'System' },
    };

    return createSuccessResponse(roomPricingDb[index], 'Room and pricing updated successfully');
  }

  const removeMatch = path.match(/^\/room\/pricing\/([^/]+)$/u);
  if (removeMatch && method === 'DELETE') {
    const uuid = removeMatch[1];
    const index = roomPricingDb.findIndex((item) => item.uuid === uuid);

    if (index === -1) {
      return createSuccessResponse(null, 'Room and pricing not found');
    }

    roomPricingDb.splice(index, 1);
    return createSuccessResponse(null, 'Room and pricing deleted successfully');
  }

  return undefined;
};
