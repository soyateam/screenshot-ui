import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubTaskDialogComponent } from './sub-task-dialog.component';

describe('SubTaskDialogComponent', () => {
  let component: SubTaskDialogComponent;
  let fixture: ComponentFixture<SubTaskDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTaskDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
