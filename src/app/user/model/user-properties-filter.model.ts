import { Category } from "src/app/properties/model/category.enum";
import { UserPropertiesStatus } from "./user-properties-status.enum";

export class UserPropertiesFilter {
    constructor(public status?: UserPropertiesStatus[], public type?: Category[]) {}
}