import { TestBed } from '@angular/core/testing';

import { AssignmentLoanService } from './assignment-loan.service';

describe('AssignmentLoanService', () => {
  let service: AssignmentLoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentLoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
