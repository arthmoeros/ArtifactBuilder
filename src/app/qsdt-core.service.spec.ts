import { TestBed, inject } from '@angular/core/testing';

import { QSDTCoreService } from './qsdt-core.service';

describe('QSDTCoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QSDTCoreService]
    });
  });

  it('should be created', inject([QSDTCoreService], (service: QSDTCoreService) => {
    expect(service).toBeTruthy();
  }));
});
