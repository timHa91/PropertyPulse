export enum SortDirection {
    Descending = 'desc',
    Ascending = 'asc'
}

export interface SortDescriptor {
    category: string;
    direction: string;
    location: string;
}