export interface ITableRow<T> {
  data: T;
}

export interface IPaginatedResponse<T> {
  data: ITableRow<T>[];
  limit: number;
  offset: number;
  count: number;
}
