export interface PaginationParam {
  page: number;
  limit: number;
}
export interface IPaging {
  total: number;
  page: number;
  limit: number;
}
export interface PaginationResult<T> {
  paging: IPaging;
  data: T[];
}
