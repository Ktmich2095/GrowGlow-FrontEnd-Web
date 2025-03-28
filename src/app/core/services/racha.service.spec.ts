import { TestBed } from '@angular/core/testing';

import { RachaService } from './racha.service';

describe('RachaService', () => {
  let service: RachaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RachaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
