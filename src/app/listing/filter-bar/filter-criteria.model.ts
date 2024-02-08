import { Category } from "src/app/shared/category.enum";
import { Status } from "../listing-status.enum";

export class FilterCriteria {
    constructor(public status?: Status[], public type?: Category[]) {}
}