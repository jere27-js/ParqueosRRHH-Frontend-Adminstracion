import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAssignedComponent } from './search-assigned.component';

describe('SearchAssignedComponent', () => {
  let component: SearchAssignedComponent;
  let fixture: ComponentFixture<SearchAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAssignedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
