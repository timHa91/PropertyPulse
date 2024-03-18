export interface PropertiesFilterForm {
    category?: { [key: string]: boolean };
    location?: { location: string };
    price?: { minPrice: number; maxPrice: number };
    radius?: { radius: number };
}