import { TestBed, inject } from '@angular/core/testing';

import { ArtifacterCoreService } from './artifacter-core.service';

describe('ArtifacterCoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtifacterCoreService]
    });
  });

  it('should be created', inject([ArtifacterCoreService], (service: ArtifacterCoreService) => {
    expect(service).toBeTruthy();
  }));
});
