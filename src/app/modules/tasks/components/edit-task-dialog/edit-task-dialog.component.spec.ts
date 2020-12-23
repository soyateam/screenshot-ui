import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTaskDialogComponent } from './edit-task-dialog.component';

describe('EditTaskComponent', () => {
  let component: EditTaskDialogComponent;
  let fixture: ComponentFixture<EditTaskDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTaskDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
