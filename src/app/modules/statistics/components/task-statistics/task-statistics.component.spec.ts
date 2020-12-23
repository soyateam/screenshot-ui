import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskStatisticsComponent } from './task-statistics.component';

describe('TaskStatisticsComponent', () => {
  let component: TaskStatisticsComponent;
  let fixture: ComponentFixture<TaskStatisticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
