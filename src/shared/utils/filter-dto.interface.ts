export interface IFilterDto<T> {
    search?: string;
    page?: number;
    pageSize?: number;
    orderBy?: keyof T; // Restrict to keys of the entity
    orderDirection?: 'ASC' | 'DESC';
}