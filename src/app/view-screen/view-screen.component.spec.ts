import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewScreenComponent } from './view-screen.component';

describe('TestComponent', () => {
  let component: ViewScreenComponent;
  let fixture: ComponentFixture<ViewScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
