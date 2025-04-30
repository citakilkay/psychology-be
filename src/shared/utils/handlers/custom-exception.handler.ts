import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export function customizeException(err: any, data: { entity: string, id?: string }): never {

    if (err instanceof QueryFailedError) {
        const conflictColumn = extractConflictColumn(err.driverError.detail)
        const conflictTable = extractReferencedTable(err.driverError.detail)
        switch (err.driverError) {
            case '23505':
                throw new HttpException(`A ${data.entity} with the given ${conflictColumn} value already exists`, HttpStatus.CONFLICT);
            case '23503':
                throw new HttpException(`${data.entity} with id ${data.id} is associated with a ${conflictTable}`, HttpStatus.CONFLICT);
            default:
                break;
        }
    }
    if (err.status) {
        throw new HttpException(err.message, err.status);
    }
    throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
}

function extractConflictColumn(detailMessage: string): string {
    const match = detailMessage.match(/\((.*?)\)=\(/);
    return match ? match[1] : 'unknown_column';
}

function extractReferencedTable(detailMessage: string): string {
    const match = detailMessage.match(/referenced from table "(.*?)"/);
    return match ? match[1] : 'unknown_table';
}