import { Component, OnInit , ElementRef } from '@angular/core';
import { HttpService, SharedService } from '../../app-common/services';
import { ServiceConstants } from '../../app-common/constants/service.constant';
import { SelectItem } from 'primeng/api';
import { StandardSearchRequest } from '../../app-common/models/standard-search-request';
import { SearchTools } from '../../app-common/services/search-tools';

@Component({
  selector: 'app-standard-search',
  templateUrl: './standard-search.component.html',
  styleUrls: ['./standard-search.component.scss']
})
export class StandardSearchComponent implements OnInit {
  searchOption = 'standard';
  criteria: StandardSearchRequest = new StandardSearchRequest();
  currentSearchCriteria: any = {};

  searchCategories: SelectItem[];

  showViewMoreFunds: boolean = false;
  showViewMoreInvestors: boolean = false;
  showViewMoreSideLetters: boolean = false;
  showViewMoreProvisions: boolean = false;

  //----------  filters
  fundList: any[] = [];
  investorList: any[] = [];
  sponsorList: any[] = [];
  businessUnitList: any[] = [];
  strategyList: any[] = [];
  investorTypeList: any[] = [];
  entityList: any[] = [];
  counselList: any[] = [];
  provisionTypeList: any[] = [];

  provisionCols: any[] = [
    { field: 'content', header: 'Provisions', headerClass: 'text-left', width: '45%' },
    { field: 'provisionType', header: 'Types', headerClass: 'text-left', width: '25%' },
    { field: 'notes', header: 'Notes', headerClass: 'text-left', width: '25%' }
  ];

  sideLetterCols: any[] = [
    { field: 'investorName', header: 'Investor', width: '10rem', headerClass: 'text-center' },
    { field: 'investorType', header: 'Type', width: '10rem', headerClass: 'text-left' },
    { field: 'fundName', header: 'Fund', width: '10rem', headerClass: 'text-center' },
    { field: 'fundSponsorName', header: 'Sponsor', width: '10rem', headerClass: 'text-left' },
    { field: 'fundStrategyName', header: 'Strategy', width: '10rem', headerClass: 'text-left' },
    { field: 'fundYear', header: 'Year', width: '8rem', headerClass: 'text-center' },
    { field: 'entity', header: 'Entity', width: '8rem', headerClass: 'text-center' },
    { field: 'counsel', header: 'Counsel', width: '8rem', headerClass: 'text-center' },
    { field: 'commitment', header: 'Commitment', width: '8rem', headerClass: 'text-center' }
  ];

  constructor(private elementRef: ElementRef,
    private http: HttpService,
    private sharedService: SharedService,
    private searchTools:SearchTools
    ) {

    this.searchCategories = [
      { label: 'All', value: 'All' },
      { label: 'Fund', value: 'Fund' },
      { label: 'Investor', value: 'Investor' },
      { label: 'Side Letter', value: 'SideLetter' },
      { label: 'Provision', value: 'Provision' }
    ];
  }

  ngOnInit() {
    //reload the criteria when the page is revisited
    let globalCriteria = this.sharedService.getGlobalSearchCriteria();
    if (globalCriteria) {
      this.criteria = globalCriteria;
      this.getSearchResults();
    }
  }

  searchResults: any;

  getSearchResults() {
    //reset the search limits
    this.criteria.fundSearchLimit = 10;
    this.criteria.investorSearchLimit = 10;
    this.criteria.sideLetterSearchLimit = 10;
    this.criteria.provisionSearchLimit = 10;

    this.sharedService.setGlobalSearchCriteria(this.criteria);
    this.sharedService.setProgressBarVisibility(true);
    this.http.post(ServiceConstants.SearchApiUrl + '/StandardSearch/', this.criteria).subscribe((results) => {
      this.sharedService.setProgressBarVisibility(false);
      this.searchResults = results;
      this.showViewMoreFunds = results.fundRows.length === this.criteria.fundSearchLimit;
      this.showViewMoreInvestors = results.investorRows.length === this.criteria.investorSearchLimit;
      this.showViewMoreSideLetters = results.sideLetterRows.length === this.criteria.sideLetterSearchLimit;
      this.showViewMoreProvisions = results.provisionRows.length === this.criteria.provisionSearchLimit;
      setTimeout(() => {
        this.highlight();
      });
    });
  }

  getMoreResults(searchCategory: string) {
    let url = '';
    switch (searchCategory) {
    case 'Fund':
      url = '/GetFundResults/';
      this.criteria.fundSearchLimit = this.criteria.fundSearchLimit + 10;
      break;
    case 'Investor':
      url = '/GetInvestorResults/';
      this.criteria.investorSearchLimit = this.criteria.investorSearchLimit + 10;
      break;
    case 'SideLetter':
      url = '/GetSideLetterResults/';
      this.criteria.sideLetterSearchLimit = this.criteria.sideLetterSearchLimit + 10;
      break;
    case 'Provision':
      url = '/GetProvisionResults/';
      this.criteria.provisionSearchLimit = this.criteria.provisionSearchLimit + 10;
      break;
    }
    this.sharedService.setGlobalSearchCriteria(this.criteria);

    this.http.post(ServiceConstants.SearchApiUrl + url, this.criteria).subscribe((results) => {
      switch (searchCategory) {
      case 'Fund':
        this.searchResults.fundRows = results;
        this.showViewMoreFunds = results.length === this.criteria.fundSearchLimit;
        break;
      case 'Investor':
        this.searchResults.investorRows = results;
        this.showViewMoreInvestors = results.length === this.criteria.investorSearchLimit;
        break;
      case 'SideLetter':
        this.searchResults.sideLetterRows = results;
        this.showViewMoreSideLetters = results.length === this.criteria.sideLetterSearchLimit;
        break;
      case 'Provision':
        this.searchResults.provisionRows = results;
        this.showViewMoreProvisions = results.length === this.criteria.provisionSearchLimit;
        break;
      }
      setTimeout(() => {
        this.highlight();
      });
    });
  }


  getFilterContents(event, filterName) {
    var body = {
      targetText: event.query,
      filterType: filterName,
      filterLimit: 5
    }
    this.http.post(ServiceConstants.SearchApiUrl + '/GetFilterContent/', body).subscribe((res) => {
      if (filterName === "Fund") {
        this.fundList = res;
      };
      if (filterName === "Investor") {
        this.investorList = res;
      };
      if (filterName === "Sponsor") {
        this.sponsorList = res;
      };
      if (filterName === "BusinessUnit") {
        this.businessUnitList = res;
      };
      if (filterName === "Strategy") {
        this.strategyList = res;
      };
      if (filterName === "InvestorType") {
        this.investorTypeList = res;
      };
      if (filterName === "Entity") {
        this.entityList = res;
      };
      if (filterName === "Counsel") {
        this.counselList = res;
      };
      if (filterName === "ProvisionType") {
        this.provisionTypeList = res;
      };;
    });

  }

  highlight() {
    this.searchTools.highlight(this.http, this.criteria.targetText, (this.elementRef.nativeElement as any) as HTMLElement);
  }

  reset() {
    this.criteria = new StandardSearchRequest();
  }


  displayResults(category) {
    if (!this.searchResults) {
      return false;
    }
    switch (category) {
    case'Fund':
        return (this.criteria.searchCategory === 'All' || this.criteria.searchCategory === category) &&
        this.searchResults.fundRows &&
        this.searchResults.fundRows.length > 0;
    case 'Investor':
        return (this.criteria.searchCategory === 'All' || this.criteria.searchCategory === category) &&
        this.searchResults.investorRows &&
        this.searchResults.investorRows.length > 0;
    case 'SideLetter':
        return (this.criteria.searchCategory === 'All' || this.criteria.searchCategory === category) &&
        this.searchResults.sideLetterRows &&
        this.searchResults.sideLetterRows.length > 0;
    case 'Provision':
        return (this.criteria.searchCategory === 'All' || this.criteria.searchCategory === category) &&
        this.searchResults.provisionRows &&
        this.searchResults.provisionRows.length > 0;
      default:
        return false;
    }
  }

  displayNoResults() {
    if (!this.searchResults) {
      return true;
    }
    if (this.criteria.searchCategory === 'All' &&
      (!this.searchResults.fundRows || this.searchResults.fundRows.length === 0) &&
      (!this.searchResults.investorRows || this.searchResults.investorRows.length === 0) &&
      (!this.searchResults.sideLetterRows || this.searchResults.sideLetterRows.length === 0) &&
      (!this.searchResults.provisionRows || this.searchResults.provisionRows.length === 0)) {
      return true;
    }

    if (this.criteria.searchCategory === 'Fund' &&
      (!this.searchResults.fundRows || this.searchResults.fundRows.length === 0)) {
      return true;
    }
    if (this.criteria.searchCategory === 'Investor' &&
      (!this.searchResults.investorRows || this.searchResults.investorRows.length === 0)) {
      return true;
    }
    if (this.criteria.searchCategory === 'SideLetter' &&
      (!this.searchResults.sideLetterRows || this.searchResults.sideLetterRows.length === 0)) {
      return true;
    }
    if (this.criteria.searchCategory === 'Provision' &&
      (!this.searchResults.provisionRows || this.searchResults.provisionRows.length === 0)) {
      return true;
    }
    return false;
  }

  availableProvisionTypes: any[];

  provisionTypeSearch(event) {
    this.http.get(ServiceConstants.ProvisionApiUrl + '/SearchProvisionTypes/' + event.query).subscribe((results) => {
      this.availableProvisionTypes = results;
    });
  }

  provisionTypeOnBlur(provision) {
    this.updateProvisionType(provision);
  }

  provisionTypeOnKeyUp(event, provision) {
    provision.isChanged = true;
    if (event.keyCode === 13) {
      this.updateProvisionType(provision);
    }
  }

  updateProvisionType(provision) {
    if (provision.isChanged) {
      provision.isChanged = false;
      this.http.put(ServiceConstants.ProvisionApiUrl, provision).subscribe(() => {
      });
    }
  }

}
