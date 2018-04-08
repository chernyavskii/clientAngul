import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestroyFormComponent } from './destroy-form.component';

describe('DestroyFormComponent', () => {
  let component: DestroyFormComponent;
  let fixture: ComponentFixture<DestroyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestroyFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestroyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
