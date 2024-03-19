import { Category } from "../model/category.enum";

export const transformToCategoryArray = (searchCategory: { [key: string]: boolean; }): Category[] => {
    const categoryArray: Category[] = [];
    Object.entries(searchCategory).forEach(([key, value]) => {
        if (value === true) {
            const upperCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
            categoryArray.push(Category[upperCaseKey as keyof typeof Category]);
        }
    });
    return categoryArray;
}