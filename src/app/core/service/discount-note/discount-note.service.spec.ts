import { TestBed } from '@angular/core/testing';

import { DiscountNoteService } from './discount-note.service';

describe('DiscountNoteService', () => {
  let service: DiscountNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
