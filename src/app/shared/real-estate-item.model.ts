import { Status } from "../listing/listing-status.enum"
import { Category } from "./category.enum"
import { GeoJson } from "./geo.model"

export class RealEstateItem {
    description: string
    address: string
    image: string
    price: number
    category: Category
    geometry: GeoJson
    status?: Status
    id?: string

    constructor(obj?: any) {
        this.description = obj && obj.description || null;
        this.image = obj && obj.image || null;
        this.address = obj && obj.address || null;
        this.price = obj && obj.price || null;
        this.category = obj && obj.category || [];
        this.geometry = obj && obj.geometry || null;
        this.status = obj && obj.status || Status.DRAFT;
    }
    
    [key: string]: any;
}