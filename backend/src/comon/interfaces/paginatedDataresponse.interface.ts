export interface PaginationMeta {
  total: number;
  currentPage: number;
  nextPage: number | null;
  lastPage: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
