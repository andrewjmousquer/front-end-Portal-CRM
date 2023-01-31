import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModelCostDuplicateMultipleComponent } from './product-model-cost-duplicate-multiple.component';

describe('ProductModelCostDuplicateMultipleComponent', () => {
  let component: ProductModelCostDuplicateMultipleComponent;
  let fixture: ComponentFixture<ProductModelCostDuplicateMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductModelCostDuplicateMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModelCostDuplicateMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
