import { EventEmitter,Injectable} from '@angular/core';

@Injectable()
export class InvestorsService {
  investorsChanged: EventEmitter<any> = new EventEmitter();
}
