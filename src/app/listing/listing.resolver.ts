import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { ListingService } from "./listing.service";
import { RealEstateItem } from "../shared/real-estate-item.model";

export const listingResolver: ResolveFn<RealEstateItem[]> = () => {
    return inject(ListingService).loadData();
}