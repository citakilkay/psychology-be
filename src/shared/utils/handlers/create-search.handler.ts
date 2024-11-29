import { FindOptionsWhere, Like } from 'typeorm';

export function createSearchConditions<T>(
    search: string | undefined,
    searchableFields: (keyof T)[]
): FindOptionsWhere<T>[] {
    if (!search) {
        return [];
    }

    return searchableFields.map((field) => ({
        [field]: Like(`%${search}%`),
    })) as FindOptionsWhere<T>[];
}
