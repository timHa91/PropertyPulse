export enum PropertiesSortDirection {
    Descending = 'desc',
    Ascending = 'asc'
}

export interface PropertiesSortDescriptor {
    category: string;
    direction: string;
    location: string;
}