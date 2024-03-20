import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { DataService } from "src/app/data/data.service";
import { Property } from "src/app/data/property.model";
import { Category } from "src/app/properties/model/category.enum";
import { PropertiesService } from "src/app/properties/service/properties.service";
import { GeoJson } from "src/app/shared/model/geo.model";

const mockProperties: Property[] = [
    {
        description: 'Test1',
        address: 'Test test',
        image: 'http://test.test',
        price: 1234,
        category: Category.Rent,
        geometry: new GeoJson([1, 11]),
        id: '1'
    },
    {
        description: 'Test2',
        address: 'Test test2',
        image: 'http://test.test',
        price: 1234,
        category: Category.Sold,
        geometry: new GeoJson([1, 41]),
        id: '2'
    },
    {
        description: 'Test3',
        address: 'Test test3',
        image: 'http://test.test',
        price: 1234,
        category: Category.Sale,
        geometry: new GeoJson([1, 31]),
        id: '3'
    },
];

describe('PropertiesService', () => {

    let propertiesService: PropertiesService;
    const dataServiceMock = {
        getAllProperties: jest.fn(),
        publishProperty: jest.fn(),
        deleteProperty: jest.fn(),
        updateProperty: jest.fn()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PropertiesService, 
                { provide: DataService, useValue: dataServiceMock}
            ],
        });

        propertiesService = TestBed.inject(PropertiesService);
    });

    it('creates a service', () => {
        expect(propertiesService).toBeTruthy();
    });

    describe('can fetch data', () => {
        it('should fetch data and update propertiesList', (done) => {
            
            dataServiceMock.getAllProperties.mockReturnValue(of(mockProperties));

            propertiesService.fetchData().subscribe(() => {
                expect(propertiesService.propertiesList).toEqual(mockProperties);
                done();
            });
        });
    });

    describe('can delete an item', () => {
        it('should delete an item and update propertiesList', (done) => {
            
            const expectedList = [
                {
                    description: 'Test2',
                    address: 'Test test2',
                    image: 'http://test.test',
                    price: 1234,
                    category: Category.Sold,
                    geometry: new GeoJson([1, 41]),
                    id: '2'
                },
                {
                    description: 'Test3',
                    address: 'Test test3',
                    image: 'http://test.test',
                    price: 1234,
                    category: Category.Sale,
                    geometry: new GeoJson([1, 31]),
                    id: '3'
                },
            ];
        
        propertiesService.propertiesList = mockProperties;
        
        propertiesService.deleteProperty('1');
        expect(dataServiceMock.deleteProperty).toHaveBeenCalledWith('1');
            
        });
    });
})