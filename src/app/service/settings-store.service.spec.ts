import { TestBed } from '@angular/core/testing';

import { SettingsStoreService } from './settings-store.service';

describe('SettingsStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsStoreService = TestBed.get(SettingsStoreService);
    expect(service).toBeTruthy();
  });
});
