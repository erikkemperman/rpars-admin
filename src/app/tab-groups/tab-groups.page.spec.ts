import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabGroupsPage } from './tab-groups.page';

describe('TabGroupsPage', () => {
  let component: TabGroupsPage;
  let fixture: ComponentFixture<TabGroupsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabGroupsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabGroupsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
