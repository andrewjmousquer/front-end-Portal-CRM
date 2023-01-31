import { Checkpoint } from './checkpoint.model';
import { Menu } from './menu.model'

export class AccessList {
  public id: number;
  public name: string;
  public menus: Menu[];
  public defaultMenu: Menu;
  public checkpoints: Checkpoint[];
  public first: number;
}
