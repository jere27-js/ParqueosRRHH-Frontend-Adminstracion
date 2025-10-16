import { TestBed } from '@angular/core/testing';

import { AcceptanceService } from './acceptance.service';

describe('AcceptanceService', () => {
  let service: AcceptanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcceptanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
