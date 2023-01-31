import { Partner } from "./partner.model";
import { Person } from "./person.model";
import { SalesTeam } from "./sales-team.model";
import { User } from "./user.model";

export class Seller {
  public id: number;
  public person: Person;
  public user: User;
  public job: number;
  public salesTeamList: SalesTeam[];
  public partnerList: Partner[];
  public agentList: Seller[];
  public first: number;
}
