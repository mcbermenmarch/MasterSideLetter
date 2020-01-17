import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService, SharedService } from '../../app-common/services';
import { StandardSearchRequest } from '../../app-common/models/standard-search-request';
import { ServiceConstants } from '../../app-common/constants/service.constant';

@Component({
  selector: 'app-precedent-search-component',
  templateUrl: './precedent-search.component.html',
  styleUrls: ['./precedent-search.component.scss']
})
export class PrecedentSearchComponent implements OnInit {
  searchOption: string = 'precedent';
  targetProvision: string;
  criteria: StandardSearchRequest = new StandardSearchRequest();
  //----------  filters
  fundList: any[] = [];
  investorList: any[] = [];
  sponsorList: any[] = [];
  businessUnitList: any[] = [];
  strategyList: any[] = [];
  investorTypeList: any[] = [];
  provisionTypeList: any[] = [];
  entityList: any[] = [];
    counselList: any[] = [];

  @ViewChild("precedentSearchTextarea", { static: false })
  precedentSearchTextarea: ElementRef;


    constructor(private http: HttpService, private sharedService: SharedService) {
  }

  ngOnInit() {
      this.criteria = this.sharedService.getGlobalSearchCriteria();
      if (this.criteria.targetText) {
        this.getSearchResults();
      }
  }

  provisions:any [];
  precedentSearchOnEnter() {
    this.getSearchResults();
    return false;
  }

  getSearchResults() {

      this.provisions = [];
      this.sharedService.setProgressBarVisibility(true);
      this.http.post(ServiceConstants.SearchApiUrl + '/PrecedentSearch', this.criteria).subscribe((results) => {
        if(results && results.length >0) {
          results.sort((a, b) => {
            return parseFloat(b.matchScore) - parseFloat(a.matchScore);
          });
        }
        this.sharedService.setProgressBarVisibility(false);
        this.provisions = results;
      });
  }

  getFilterContents(event, filterName) {
    var body = {
      targetText: event.query,
      filterType: filterName,
      filterLimit: 5
    }
    this.http.post(ServiceConstants.SearchApiUrl + '/GetFilterContent/', body).subscribe((res) => {
      if (filterName === "Fund") { this.fundList = res };
      if (filterName === "Investor") { this.investorList = res };
      if (filterName === "Sponsor") { this.sponsorList = res };
      if (filterName === "BusinessUnit") { this.businessUnitList = res };
      if (filterName === "Strategy") { this.strategyList = res };
      if (filterName === "InvestorType") { this.investorTypeList = res };
      if (filterName === "Entity") { this.entityList = res };
      if (filterName === "Counsel") { this.counselList = res };
      if (filterName === "ProvisionType") { this.provisionTypeList = res };

    });
  }

  reset() {
    this.criteria = new StandardSearchRequest();
  }

}
