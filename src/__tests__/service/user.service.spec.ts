import { of } from 'rxjs';
import { Property } from 'src/app/data/property.model';
import { Category } from 'src/app/shared/model/category.enum';
import { GeoJson } from 'src/app/shared/model/geo.model';
import { UserPropertiesStatus } from 'src/app/user/model/user-properties-status.enum';
import { UserService } from 'src/app/user/service/user.service';

describe('UserService', () => {
 let service: UserService;
 let dataServiceMock: any;

 beforeEach(() => {
    // Mock DataService
    dataServiceMock = {
      getUserProperties: jest.fn(),
      storeNewProperty: jest.fn(),
      updateUserProperty: jest.fn(),
      deleteUserProperty: jest.fn(),
    };

    // Instanziieren des UserService mit dem gemockten DataService
    service = new UserService(dataServiceMock);
 });

 // Beispieltest für die loadData Methode
 it('should load data', (done) => {
    // Beispiel Property Objekt
    const mockProperty: Property = {
      description: 'Test Property',
      address: '123 Test Street',
      image: 'http://test.jpg',
      price: 1000,
      category: Category.Rent,
      geometry: new GeoJson([-76.932458, 38.905337]),
      status: UserPropertiesStatus.PUBLISHED,
      id: '1',
    };

    // Mock DataService, um ein Observable mit dem Beispiel Property zurückzugeben
    dataServiceMock.getUserProperties.mockReturnValue(of([mockProperty]));

    service.loadData().subscribe(properties => {
      expect(properties).toEqual([mockProperty]);
      expect(service.userList).toEqual([mockProperty]);
      done();
    });
 });

});
