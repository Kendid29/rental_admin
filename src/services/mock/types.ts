export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ResponseWrapper<T> {
  data: T;
  success: boolean;
  message: string;
  pagination?: {
    data_per_page: number;
    next_page: number;
    prev_page: number;
    first_page: number;
    last_page: number;
    next_page_url: string;
    previous_page_url: string;
    first_page_url: string;
    last_page_url: string;
    total_page: number;
    total_data: number;
  };
}

export interface MockRequestContext {
  path: string;
  queryParams: URLSearchParams;
  method: HttpMethod;
  data?: any;
}

export type MockResult = ResponseWrapper<any> | undefined;
