import { Category } from "src/app/properties/model/category.enum";
import { transformToCategoryArray } from "src/app/properties/utils/transform-to-category-array";

describe('Transform To Category Array', () => {
    it('should transform category object to array correctly', () => { // <-- Move the callback function here
        
        const data = {
            'rent': true,
            'sale': false,
            'sold': true
        }

        const expectedResult = [Category.Rent, Category.Sold];

        const result = transformToCategoryArray(data);

        expect(expectedResult).toEqual(result);
    });
});
