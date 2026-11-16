import { createSuccessResponse } from './common';
import { MockRequestContext, MockResult } from './types';
import { ActivityItemType } from '@/lib/types/activity.type';

let activityDb: ActivityItemType[] = [
  {
    uuid: 'act-001',
    title: 'Island Activities',
    description: 'Explore the beauty of the island, enjoy the pristine natural surroundings, and discover hidden spots that are simply breathtaking.',
    image: { uuid: 'img-1', url: '/assets/images/thumbs/service-thumb1.jpg' },
    is_active: true,
  },
  {
    uuid: 'act-002',
    title: 'Water Tourism',
    description: 'Dive into crystal-clear waters. Enjoy snorkeling, diving, and various other exciting water sports.',
    image: { uuid: 'img-2', url: '/assets/images/thumbs/service-thumb2.jpg' },
    is_active: true,
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

const filterActivity = (search: string) => {
  if (!search) return activityDb;

  return activityDb.filter((item) => {
    return (
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });
};

export const handleActivityMock = ({
  path,
  queryParams,
  method,
  data
}: MockRequestContext): MockResult => {
  if (path === '/activity/admin' && method === 'GET') {
    const { page, perPage } = parsePagingParams(queryParams);
    const search = (queryParams.get('search_param') || '').toLowerCase();
    const filtered = filterActivity(search);
    const result = paginate(filtered, page, perPage);

    return {
      data: result.data,
      success: true,
      message: 'Success',
      pagination: result.pagination,
    };
  }

  const detailMatch = path.match(/^\/activity\/admin\/([^/]+)\/detail$/u);
  if (detailMatch && method === 'GET') {
    const activity = activityDb.find((item) => item.uuid === detailMatch[1]);
    return createSuccessResponse(activity || null);
  }

  if (path === '/activity/admin/create' && method === 'POST') {
    const newData: ActivityItemType = {
      uuid: `act-00${activityDb.length + 1}`,
      title: data.title,
      description: data.description,
      image: { uuid: 'img-new', url: data.image_uuid || '/assets/images/thumbs/service-thumb1.jpg' },
      is_active: data.is_active !== undefined ? data.is_active : true,
    };
    activityDb = [newData, ...activityDb];
    return createSuccessResponse(newData);
  }

  const updateMatch = path.match(/^\/activity\/admin\/([^/]+)\/edit$/u);
  if (updateMatch && method === 'PUT') {
    const index = activityDb.findIndex((item) => item.uuid === updateMatch[1]);
    if (index > -1) {
      activityDb[index] = {
        ...activityDb[index],
        title: data.title,
        description: data.description,
        image: data.image_uuid ? { uuid: data.image_uuid, url: data.image_uuid } : activityDb[index].image,
        is_active: data.is_active !== undefined ? data.is_active : activityDb[index].is_active,
      };
      return createSuccessResponse(activityDb[index]);
    }
  }

  const deleteMatch = path.match(/^\/activity\/admin\/([^/]+)\/remove$/u);
  if (deleteMatch && method === 'DELETE') {
    activityDb = activityDb.filter((item) => item.uuid !== deleteMatch[1]);
    return createSuccessResponse(null);
  }

  return undefined;
};
