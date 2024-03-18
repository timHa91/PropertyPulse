import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { PropertiesService } from '../service/properties.service';
import { Property } from '../../shared/model/property.model';

export const propertiesResolver: ResolveFn<Property[]> = () => {
    return inject(PropertiesService).fetchData();
};
