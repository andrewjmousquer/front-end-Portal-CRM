import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModelCostDuplicateSingleComponent } from './product-model-cost-duplicate-single.component';

describe('ProductModelCostDuplicateSingleComponent', () => {
  let component: ProductModelCostDuplicateSingleComponent;
  let fixture: ComponentFixture<ProductModelCostDuplicateSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductModelCostDuplicateSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModelCostDuplicateSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
