export function extractConflictColumn(detailMessage: string): string {
    const match = detailMessage.match(/\((.*?)\)=\(/);
    return match ? match[1] : 'unknown_column';
}

export function extractReferencedTable(detailMessage: string): string {
    const match = detailMessage.match(/referenced from table "(.*?)"/);
    return match ? match[1] : 'unknown_table';
}

