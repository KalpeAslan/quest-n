export interface IPagination<T> {
  results?: T[];
  total?: number;
  page: number;
  pageSize: number;
}

export interface IPaginationQuery {
  page?: number;
  pageSize?: number;
  usePagination: boolean;
}
