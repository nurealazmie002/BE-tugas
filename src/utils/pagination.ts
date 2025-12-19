export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}


export const parsePaginationParams = (query: any): Required<PaginationParams> => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;

  const validPage = page < 1 ? 1 : page;
  
  const validLimit = limit < 1 ? 10 : limit > 100 ? 100 : limit;

  return {
    page: validPage,
    limit: validLimit,
  };
};


export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};


export const generatePaginationMeta = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};


export const createPaginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> => {
  return {
    data,
    meta: generatePaginationMeta(page, limit, total),
  };
};