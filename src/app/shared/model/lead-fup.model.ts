import { Classifier } from "./classifier.model";
import { Person } from "./person.model";

export class LeadFup
{
	public id: number;
  public action: string;
  public leadId: number;
	public date: Date;
	public media: Classifier;
	public person: string;
	public comment: string;
}
