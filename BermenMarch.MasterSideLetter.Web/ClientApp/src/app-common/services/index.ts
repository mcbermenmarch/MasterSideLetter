import { HttpService } from "./http.service";
import { UtilityService } from "./utility.service";
import { SharedService } from "./sharedService";
import { SearchTools } from "./search-tools";
import { FundsService } from "./funds.service";
import { InvestorsService } from "./investors.service";
import { MessageService } from "primeng/api";


export const SERVICES = [
  HttpService,
  UtilityService,
  SharedService,
  SearchTools,
  FundsService,
  InvestorsService,
  { provide: MessageService, useClass: MessageService }
];

export {
  HttpService,
  UtilityService,
  SharedService,
  SearchTools,
  FundsService,
  InvestorsService
}
