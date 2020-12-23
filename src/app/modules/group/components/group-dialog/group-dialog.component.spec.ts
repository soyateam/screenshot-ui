import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupDialogComponent } from './group-dialog.component';

describe('GroupDialogComponent', () => {
  let component: GroupDialogComponent;
  let fixture: ComponentFixture<GroupDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
