import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudVehiclesComponent } from './crud-vehicles.component';

describe('CrudVehiclesComponent', () => {
  let component: CrudVehiclesComponent;
  let fixture: ComponentFixture<CrudVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudVehiclesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
