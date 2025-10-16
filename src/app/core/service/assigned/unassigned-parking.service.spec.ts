import { TestBed } from '@angular/core/testing';

import { UnassignedParkingService } from './unassigned-parking.service';

describe('UnassignedParkingService', () => {
  let service: UnassignedParkingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnassignedParkingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
