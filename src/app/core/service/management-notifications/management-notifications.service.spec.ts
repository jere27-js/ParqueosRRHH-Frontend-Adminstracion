import { TestBed } from '@angular/core/testing';

import { ManagementNotificationsService } from './management-notifications.service';

describe('ManagementNotificationsService', () => {
  let service: ManagementNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagementNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
