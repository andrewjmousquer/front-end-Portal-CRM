import { TreeNode } from "primeng/api";
import { Qualification } from "./qualification.model";

export class QualificationTree extends Qualification {
  public level: number;
  public breadcrumbIdPath: string;
  public breadcrumbNamePath: string;
  public childrens: QualificationTree[];
}
