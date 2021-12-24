import { TestBed, inject } from '@angular/core/testing';

import { SessionMgtService } from './session-mgt.service';

describe('SessionMgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionMgtService]
    });
  });

  it('should be created', inject([SessionMgtService], (service: SessionMgtService) => {
    expect(service).toBeTruthy();
  }));
});
