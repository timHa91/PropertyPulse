import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { UserService } from "../service/user.service";
import { Property } from "../../data/property.model";

export const userResolver: ResolveFn<Property[]> = () => {
    return inject(UserService).loadData();
}