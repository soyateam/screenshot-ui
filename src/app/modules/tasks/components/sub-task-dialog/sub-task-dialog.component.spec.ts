import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTaskDialogComponent } from './sub-task-dialog.component';

describe('SubTaskDialogComponent', () => {
  let component: SubTaskDialogComponent;
  let fixture: ComponentFixture<SubTaskDialogComponent>;

  beforeEach(async(() => {
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
