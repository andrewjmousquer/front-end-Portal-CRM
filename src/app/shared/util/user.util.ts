import { Injectable } from '@angular/core';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserUtil {
    static isCheckpointEnable(checkpointName: string): boolean{
        const user: User = JSON.parse(sessionStorage.getItem('user'));       
        if(user && user.accessList && user.accessList.checkpoints){
            return user.accessList.checkpoints.some(ckp => ckp.name === checkpointName);
        }
        return false;
    }
}
