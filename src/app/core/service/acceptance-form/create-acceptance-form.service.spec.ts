import { TestBed } from '@angular/core/testing';

import { CreateAcceptanceFormService } from './create-acceptance-form.service';

describe('CreateAcceptanceFormService', () => {
  let service: CreateAcceptanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAcceptanceFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
