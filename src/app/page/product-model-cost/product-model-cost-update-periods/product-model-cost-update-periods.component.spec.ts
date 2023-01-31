import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModelCostUpdatePeriodsComponent } from './product-model-cost-update-periods.component';

describe('ProductModelCostUpdatePeriodsComponent', () => {
  let component: ProductModelCostUpdatePeriodsComponent;
  let fixture: ComponentFixture<ProductModelCostUpdatePeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductModelCostUpdatePeriodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModelCostUpdatePeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
