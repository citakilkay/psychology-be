// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IFilterDto<T, OrderByKeys> {
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: OrderByKeys; // Restrict to keys of the entity
  orderDirection?: 'ASC' | 'DESC';
}
