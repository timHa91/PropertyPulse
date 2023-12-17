import { Category } from "../shared/category.enum"

export class SearchCriteria {
    constructor(public category?: Category[], public minPrice?: number, public maxPrice?: number, public location?: string, public radius?: number) {}
}