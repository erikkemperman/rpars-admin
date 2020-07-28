import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabMeasurePage } from './tab-measure.page';

describe('TabMeasurePage', () => {
  let component: TabMeasurePage;
  let fixture: ComponentFixture<TabMeasurePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabMeasurePage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabMeasurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
