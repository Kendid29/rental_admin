import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';
import { PackageTourType, PackageTourPricingType, PackageTourCalendarDateType } from '@/lib/types/package-tour.type';

const packageTourDb: PackageTourType[] = [
  {
    uuid: 'tour-001',
    name: 'Island Hopping Adventure',
    code: 'IHA-001',
    description: 'Explore the hidden gems of the archipelago with our luxury boat tour.',
    quantity: 100,
    current_quantity: 85,
    is_active: true,
    image: {
      uuid: 'img-001',
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400',
    },
    image_uuid: 'img-001',
    version: 1,
    created: { at: '2024-01-01T00:00:00Z', by: 'System' },
    updated: { at: '2024-01-01T00:00:00Z', by: 'System' },
  },
  {
    uuid: 'tour-002',
    name: 'Mountain Trekking Expedition',
    code: 'MTE-002',
    description: 'Breathtaking views and challenging trails for nature enthusiasts.',
    quantity: 50,
    current_quantity: 42,
    is_active: true,
    image: {
      uuid: 'img-002',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
    },
    image_uuid: 'img-002',
    version: 1,
    created: { at: '2024-01-02T00:00:00Z', by: 'System' },
    updated: { at: '2024-01-02T00:00:00Z', by: 'System' },
  },
];

const packageTourPricingDb: PackageTourPricingType[] = [
  {
    uuid: 'pricing-001',
    date: '2026-07-16',
    quantity: 10,
    package_tour: packageTourDb[0],
    villa_class: {
        uuid: 'villa-001',
        name: 'Villa Class A',
        code: 'VCA',
        description: 'Luxury class',
        version: 1,
        created: { at: '2024-01-01T00:00:00Z', by: 'System' },
        updated: { at: '2024-01-01T00:00:00Z', by: 'System' },
    },
    min_qty: 2,
    description: 'Special package with snorkeling equipment included.',
    price_ranges: [
        { from_quantity: 1, to_quantity: 5, price: 1500000, agent_price: 1350000 },
        { from_quantity: 6, to_quantity: 10, price: 1250000, agent_price: 1100000 }
    ],
    addons: [
      {
        uuid: 'pta-001',
        addon: {
          uuid: 'ra-001',
          name: 'Extra Breakfast',
          description: 'Additional breakfast buffet',
          code: 'RA-001',
          version: 1,
          created: { at: '2024-01-01T00:00:00Z', by: 'System' },
          updated: { at: '2024-01-01T00:00:00Z', by: 'System' },
        },
        price_tiers: [
          { from_quantity: 1, to_quantity: 5, price: 50000, agent_price: 45000 },
          { from_quantity: 6, to_quantity: 10, price: 40000, agent_price: 35000 }
        ]
      }
    ],
    is_cancellable: true,
    is_rescheduleable: true,
    is_published: true,
    is_refundable: true,
    is_transferable: false,
    version: 1,
  },
  {
    uuid: 'pricing-002',
    date: '2026-07-17',
    quantity: 15,
    package_tour: packageTourDb[0],
    villa_class: {
        uuid: 'villa-002',
        name: 'Villa Class B',
        code: 'VCB',
        description: 'Standard class',
        version: 1,
        created: { at: '2024-01-01T00:00:00Z', by: 'System' },
        updated: { at: '2024-01-01T00:00:00Z', by: 'System' },
    },
    min_qty: 1,
    description: 'Basic tour package.',
    price_ranges: [
        { from_quantity: 1, to_quantity: 20, price: 1000000, agent_price: 850000 }
    ],
    addons: [],
    is_cancellable: true,
    is_rescheduleable: true,
    is_published: true,
    is_refundable: true,
    is_transferable: false,
    version: 1,
  },
];

export const handlePackageTourMock = ({
  path,
  queryParams,
  method,
}: MockRequestContext): MockResult => {
  // Package Tour List
  if (path === '/promo/package-tour' && method === 'GET') {
    return createSuccessResponse(packageTourDb);
  }

  // Package Tour Detail
  const tourDetailMatch = path.match(/^\/promo\/package-tour\/([^/]+)$/u);
  if (tourDetailMatch && method === 'GET') {
    const tour = packageTourDb.find((item) => item.uuid === tourDetailMatch[1]);
    return createSuccessResponse(tour || null);
  }

  // Package Tour Pricing List
  if (path === '/master-data/package-tour/pricing' && method === 'GET') {
    const date = queryParams.get('date');
    if (date) {
        const filtered = packageTourPricingDb.filter((p) => p.date === date);
        return createSuccessResponse(filtered);
    }
    return createSuccessResponse(packageTourPricingDb);
  }

  // Package Tour Pricing Calendar
  if (path === '/master-data/package-tour/pricing/calendar-filter' && method === 'GET') {
    // For mock simplicity, we'll return dates that have pricing
    const calendarData: PackageTourCalendarDateType[] = [
        { date: '2026-07-16', total_pricing: 1 },
        { date: '2026-07-17', total_pricing: 1 },
    ];
    return createSuccessResponse(calendarData);
  }

  // Package Tour Pricing Detail
  const pricingDetailMatch = path.match(/^\/master-data\/package-tour\/pricing\/([^/]+)$/u);
  if (pricingDetailMatch && method === 'GET' && pricingDetailMatch[1] !== 'calendar-filter') {
    const pricing = packageTourPricingDb.find((item) => item.uuid === pricingDetailMatch[1]);
    return createSuccessResponse(pricing || null);
  }

  return undefined;
};
