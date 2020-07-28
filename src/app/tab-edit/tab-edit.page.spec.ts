import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabEditPage } from './tab-edit.page';

describe('TabEditPage', () => {
  let component: TabEditPage;
  let fixture: ComponentFixture<TabEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabEditPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
