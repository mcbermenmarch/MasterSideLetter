import { EventEmitter } from "@angular/core";
import { StandardSearchRequest } from 'src/app-common/models/standard-search-request';

export class SharedService {
  private targetProvision = "";
  searchCriteriaChanged: EventEmitter<any> = new EventEmitter();

  setTargetProvision(targetProvision) {
    this.targetProvision = targetProvision;
  }

  getTargetProvision() {
    return this.targetProvision;
  }


  progressBarVisibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  setProgressBarVisibility(val: boolean) {
    this.progressBarVisibilityChanged.emit(val);
  }

  private globalSearchCriteria: StandardSearchRequest = new StandardSearchRequest() ;

  setGlobalSearchCriteria(criteria) {
    this.globalSearchCriteria = criteria;
  }
  getGlobalSearchCriteria() {
    return this.globalSearchCriteria;
  }


  private fundListSearchCriteria: any;
  setFundListSearchCriteria(criteria) { this.fundListSearchCriteria = criteria; }
  getFundListSearchCriteria() { return this.fundListSearchCriteria; }

  private fundListSearchResults: any;
  setFundListSearchResults(results) { this.fundListSearchResults = results; }
  getFundListSearchResults() { return this.fundListSearchResults; }


  private fundProfileSearchCriteria: any;
  setFundProfileSearchCriteria(criteria) { this.fundProfileSearchCriteria = criteria; }
  getFundProfileSearchCriteria() { return this.fundProfileSearchCriteria; }

  private fundProfileSearchResults: any;
  setFundProfileSearchResults(results) { this.fundProfileSearchResults = results; }
  getFundProfileSearchResults() { return this.fundProfileSearchResults; }


  private investorListSearchCriteria: any;
  setInvestorListSearchCriteria(criteria) { this.investorListSearchCriteria = criteria; }
  getInvestorListSearchCriteria() { return this.investorListSearchCriteria; }

  private investorListResults: any;
  setInvestorListSearchResults(results) { this.investorListResults = results; }
  getInvestorListSearchResults() { return this.investorListResults; }



  private investorProfileSearchCriteria: any;
  setInvestorProfileSearchCriteria(criteria) { this.investorProfileSearchCriteria = criteria; }
  getInvestorProfileSearchCriteria() { return this.investorProfileSearchCriteria; }

  private investorProfileResults: any;
  setInvestorProfileSearchResults(results) { this.investorProfileResults = results; }
  getInvestorProfileSearchResults() { return this.investorProfileResults; }



  private selectedFundInvestorIds = [];
  setSelectedFundInvestorIds(ids) {
    this.selectedFundInvestorIds = ids;
  };

  getSelectedFundInvestorIds() {
    return this.selectedFundInvestorIds;
  }
}
