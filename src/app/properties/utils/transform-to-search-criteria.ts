import { PropertiesFilterForm } from "../model/properties-filter-form.model";
import { PropertiesFilter } from "../model/properties-filter.model";
import { transformToCategoryArray } from "./transform-to-category-array";

export const transformToSearchCriteria = (searchForm: PropertiesFilterForm): PropertiesFilter => {
    const searchCriteria = new PropertiesFilter();

    if (searchForm.category) {
        searchCriteria.category = transformToCategoryArray(searchForm.category);
    }

    if (searchForm.location) {
        searchCriteria.location = searchForm.location.location;
    }

    if (searchForm.price) {
        searchCriteria.minPrice = searchForm.price.minPrice;
        searchCriteria.maxPrice = searchForm.price.maxPrice;
    }

    if (searchForm.radius) {
        searchCriteria.radius = searchForm.radius.radius;
    }
    return searchCriteria;
}