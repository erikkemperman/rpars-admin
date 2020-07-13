import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';

import { AppComponent } from './app.component';


describe('AppComponent', () => {

  let platformReadySpy: Promise<void>;
  let platformIsSpy: Promise<boolean>;
  let platformSpy: jasmine.SpyObj<Platform>;

  beforeEach(async(() => {
    platformReadySpy = Promise.resolve();
    platformIsSpy = Promise.resolve(false);
    platformSpy = jasmine.createSpyObj(Platform, {
      ready: platformReadySpy,
      is: platformIsSpy
    });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Platform, useValue: platformSpy },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(platformSpy.is).toHaveBeenCalled();
    await platformIsSpy;
  });

  // TODO: add more tests!

});
