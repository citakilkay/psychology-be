import { FindOptionsWhere, ILike } from 'typeorm';

export function handleSearchConditions<T>(
  search: string | undefined,
  searchableFields: (keyof T)[],
): FindOptionsWhere<T>[] {
  if (!search) {
    return [];
  }

  return searchableFields.map((field) => ({
    [field]: ILike(`%${search}%`),
  })) as FindOptionsWhere<T>[];
}
