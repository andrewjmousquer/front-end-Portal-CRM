import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModelCostUpdateValuesComponent } from './product-model-cost-update-values.component';

describe('ProductModelCostUpdateValuesComponent', () => {
  let component: ProductModelCostUpdateValuesComponent;
  let fixture: ComponentFixture<ProductModelCostUpdateValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductModelCostUpdateValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModelCostUpdateValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
