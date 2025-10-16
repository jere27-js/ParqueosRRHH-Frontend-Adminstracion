import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceFormComponent } from './acceptance-form.component';

describe('AcceptanceFormComponent', () => {
  let component: AcceptanceFormComponent;
  let fixture: ComponentFixture<AcceptanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptanceFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceptanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
