import { TestBed } from '@angular/core/testing';

import { SabiasQueService } from './sabias-que.service';

describe('SabiasQueService', () => {
  let service: SabiasQueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SabiasQueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
