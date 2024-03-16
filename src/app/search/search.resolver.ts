import { ActivatedRouteSnapshot, RouterStateSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { SearchService } from './search.service';
import { RealEstateItem } from '../shared/real-estate-item.model';

export const searchResolver: ResolveFn<RealEstateItem[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(SearchService).loadData();
};
