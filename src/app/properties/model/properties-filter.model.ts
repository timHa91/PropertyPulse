import { Category } from "../../shared/model/category.enum";

export class PropertiesFilter {
    constructor(
        public category: Category[] = [],
        public minPrice?: number,
        public maxPrice?: number,
        public location?: string,
        public radius?: number
    ) {}
}
