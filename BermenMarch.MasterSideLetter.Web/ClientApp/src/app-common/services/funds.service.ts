import { EventEmitter,Injectable} from '@angular/core';

@Injectable()
export class FundsService {
  fundsChanged: EventEmitter<any> = new EventEmitter();
}
