import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SecondaryBarGraphComponent } from './secondary-bar-graph.component';

describe('SecondaryBarGraphComponent', () => {
  let component: SecondaryBarGraphComponent;
  let fixture: ComponentFixture<SecondaryBarGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryBarGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
