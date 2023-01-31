import { ModelItemCost } from "src/app/shared/model/model-item-cost.model";

export class ModelItemCostAdjustement {
  public action: String = "adjust"; // adjust ou reset
  public adjustement: String = "percent"; // percent ou monetary
  public percentValue: number;
  public monetaryValue: number;
  public startDate: Date;
  public endDate: Date;
  public modelItemCost: ModelItemCost;
  public modelItemCostList: ModelItemCost[];
}
