import { TestBed } from '@angular/core/testing';

import { GetAllLocationsService } from './get-all-locations.service';

describe('GetAllLocationsService', () => {
  let service: GetAllLocationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllLocationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
