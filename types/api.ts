export interface ApiResponse<T> {
  data?: T;
  message: string;
}

export interface ApiErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

export interface ActionResponse<T = undefined> {
  message: string;
  data?: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

