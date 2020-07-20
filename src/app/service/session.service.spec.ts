import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  let sessionInitSpy;
  let sessionFiniSpy;
  let sessionSpy: jasmine.SpyObj<ApiService>;


  beforeEach(() => {
    sessionInitSpy = Promise.resolve();
    sessionFiniSpy = Promise.resolve();
    sessionSpy = jasmine.createSpyObj(ApiService, {
      sessionInit: sessionInitSpy,
      sessionFini: sessionFiniSpy
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: sessionSpy },
      ]
    }).compileComponents();
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
