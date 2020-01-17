import { Component, ViewChild , ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { SharedService, HttpService } from '../app-common/services';
import { ServiceConstants } from '../app-common/constants/service.constant';
import { Panel } from 'primeng/panel';
import { SelectItem } from 'primeng/api';
import { StandardSearchRequest } from  '../app-common/models/standard-search-request';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  //----------  vars
  
  searchCategories: SelectItem[];

  criteria: StandardSearchRequest = new StandardSearchRequest();
  
  searchCollapsed=true;
  searchOption: string = 'precedent';
  targetProvision: string = '';

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


  @ViewChild("searchPanel", { static: false }) searchPanel: Panel;
  @ViewChild("precedentSearchTextarea", { static: false }) precedentSearchTextarea: ElementRef;
  @ViewChild("standardSearchInput", { static: false }) standardSearchInput: ElementRef;

  constructor(
    private http: HttpService,
    private sharedService: SharedService,
    private router: Router) {

    this.searchOption = 'precedent';
    this.searchCategories = [
      { label: 'All', value: 'All' },
      { label: 'Fund', value: 'Fund' },
      { label: 'Investor', value: 'Investor' },
      { label: 'Side Letter', value: 'SideLetter' },
      { label: 'Provision', value: 'Provision' }
    ];
  }


  progressBarVisible = false;
  ngOnInit() {
    this.searchOption = "precedent";
    this.router.events.subscribe(() => {
      this.searchCollapsed = true;
    });
    this.sharedService.progressBarVisibilityChanged.subscribe((state) => {
      setTimeout(() => {
        this.progressBarVisible = state;
      });
    });
  }

  precedentSearchOnEnter() {
    this.search();
    return false;
  }


  toggleSearch(event) {
    if (this.router.url !== '/standard-search' && this.router.url !== '/precedent-search') {
      this.searchPanel.toggle(event);
      this.setSearchFocus();
    }
  }


    reset() {
      this.criteria = new StandardSearchRequest();
    }
  search() {
    this.sharedService.setGlobalSearchCriteria(this.criteria);
    if (this.searchOption === "precedent") {
      this.router.navigate(['/precedent-search']);
    } else {
      this.router.navigate(['/standard-search']);
    }
  }

  sponsorOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.search();
    }
  }

  setSearchFocus() {
    setTimeout(() => {
        if (this.precedentSearchTextarea) {
          (((this.precedentSearchTextarea.nativeElement) as any) as HTMLInputElement).focus();
        } else
        if (this.standardSearchInput) {
          (((this.standardSearchInput.nativeElement) as any) as HTMLInputElement).focus();
        }
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
}








