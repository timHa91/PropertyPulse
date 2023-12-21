import { Category } from "./category.enum"
import { GeoJson } from "./geo.model"

export class RealEstateItem {
    description: string
    address: string
    images: string[]
    price: number
    category: Category
    geometry: GeoJson

    constructor(obj?: any) {
        this.description = obj && obj.description || null;
        this.images = obj && obj.image || [];
        this.address = obj && obj.adress || null;
        this.price = obj && obj.price || null;
        this.category = obj && obj.category || [];
        this.geometry = obj && obj.geometry || null;
    }
}