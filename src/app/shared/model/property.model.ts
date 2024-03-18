import { UserPropertiesStatus } from "../../user/model/user-properties-status.enum"
import { Category } from "./category.enum"
import { GeoJson } from "./geo.model"

export class Property {
    description: string
    address: string
    image: string
    price: number
    category: Category
    geometry: GeoJson
    status?: UserPropertiesStatus
    id?: string

    constructor(obj?: any) {
        this.description = obj && obj.description || null;
        this.image = obj && obj.image || null;
        this.address = obj && obj.address || null;
        this.price = obj && obj.price || null;
        this.category = obj && obj.category || [];
        this.geometry = obj && obj.geometry || null;
        this.status = obj && obj.status || UserPropertiesStatus.DRAFT;
    }
    
    [key: string]: any;
}