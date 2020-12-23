import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MasterTasksComponent } from './master-tasks.component';

describe('MasterTasksComponent', () => {
  let component: MasterTasksComponent;
  let fixture: ComponentFixture<MasterTasksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
