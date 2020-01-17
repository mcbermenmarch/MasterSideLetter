import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService, SharedService } from '../../app-common/services';
import { ServiceConstants } from '../../app-common/constants/service.constant';
import { Investor } from '../../app-common/models/investor';
import { ActivatedRoute, Router } from '@angular/router';
import { FundInvestor } from '../../app-common/models/fundInvestor';
import { SortEvent } from 'primeng/primeng';
import { MenuItem } from 'primeng/api';
import { StandardSearchRequest } from '../../app-common/models/standard-search-request';
import { SearchTools } from '../../app-common/services/search-tools';

@Component({
  selector: 'app-investor-profile',
  templateUrl: './investor-profile.component.html',
  styleUrls: ['./investor-profile.component.scss']
})
export class InvestorProfileComponent implements OnInit {

  @ViewChild("mslUploader", { static: false }) mslUploader: ElementRef;
  get mslFileInput(): HTMLInputElement {
    return ((this.mslUploader.nativeElement) as any) as HTMLInputElement;
  }

  @ViewChild("mfnUploader", { static: false }) mfnUploader: ElementRef;
  get mfnFileInput(): HTMLInputElement {
    return ((this.mfnUploader.nativeElement) as any) as HTMLInputElement;
  }

  @ViewChild("batchUploader", { static: false }) batchUploader: ElementRef;
  get batchFileInput(): HTMLInputElement {
    return ((this.batchUploader.nativeElement) as any) as HTMLInputElement;
  }

  @ViewChild("sideLetterUploader", { static: false }) sideLetterUploader: ElementRef;
  get sideLetterFileInput(): HTMLInputElement {
    return ((this.sideLetterUploader.nativeElement) as any) as HTMLInputElement;
  }


  cols: any[] = [
    { field: 'entity', header: 'Entity', headerClass: 'text-left', width: '11rem', type: 'text' },
    { field: 'fundSponsorName', header: 'Sponsor', headerClass: 'text-left', width: '11rem', type: 'text' },
    { field: 'fundBusinessUnitName', header: 'Business Unit', headerClass: 'text-left', width: '11rem', type: 'text' },
    { field: 'fundStrategyName', header: 'Strategy', headerClass: 'text-left', width: '11rem', type: 'text' },
    { field: 'fundYear', header: 'Year', headerClass: 'text-left', width: '5rem', type: 'number' },
    { field: 'fundSize', header: 'Size', headerClass: 'text-left', width: '5rem', type: 'number' },
    { field: 'commitment', header: 'Commitment', headerClass: 'text-left', width: '8rem', type: 'number' },
    { field: 'counsel', header: 'Counsel', headerClass: 'text-left', width: '10rem', type: 'text' },
    { field: 'notes', header: 'Notes', headerClass: 'text-left', width: '10rem', type: 'text' }
  ];

  tagProvisionsMenuItem: MenuItem = { label: 'Tag Provisions', disabled: true, command: () => { this.tagProvisions(); } };

  batchUploadMenuItem: MenuItem = { label: 'Batch Upload', command: () => { this.batchFileInput.click(); } };
  batchDownloadMenuItem: MenuItem = { label: 'Batch Download' };
  batchDeleteMenuItem: MenuItem = { label: 'Batch Delete', command: () => { this.batchDelete(); } };
  addFundMenuItem: MenuItem = { label: 'Add Fund', icon: 'fa fa-plus-circle', styleClass: 'text-highlight-dark', command: () => { this.addFund(); } };

  menuBarItems: MenuItem[] = [
    this.tagProvisionsMenuItem,
    { separator: true },
    this.batchUploadMenuItem,
    { separator: true },
    this.batchDownloadMenuItem,
    { separator: true },
    this.batchDeleteMenuItem,
    { separator: true },
    this.addFundMenuItem
  ];

  collapsedMenuBarItems: MenuItem[] = [
    {
      icon: 'fa fa-bars',
      styleClass: 'collapsed-menu',
      items: [
        this.tagProvisionsMenuItem,
        this.batchUploadMenuItem,
        this.addFundMenuItem
      ]
    }
  ];

  investorId: number;
  availableFunds: any[];
  investorDetails: Investor = new Investor();
  originalInvestorDetails: any;
  favInvestors: Investor[] = [];
  recentlyViewedInvestor: Investor[] = [];
  rows: any[] = [];

  isAllSelected: boolean;
  adding: boolean;
  dataKey = 'id';
  defaultSortField = 'investorName';
  defaultSortOrder = 1;
  editingRowKeys: any = {};
  showConfirmDialog: boolean;
  deleteRow: FundInvestor;
  confirmDialogMessage = 'Remove Fund(s) from Investor?';
  sideLetterUploaderFundInvestor: FundInvestor;
  originalRows: any;
  editingInvestorDetails: boolean = false;

  // search vars
  showViewMoreSideLetters: boolean = false;
  showViewMoreProvisions: boolean = false;
  showSearch: boolean;
  // search filters
  criteria: StandardSearchRequest = new StandardSearchRequest();
  fundList: any[] = [];
  investorList: any[] = [];
  sponsorList: any[] = [];
  businessUnitList: any[] = [];
  strategyList: any[] = [];
  investorTypeList: any[] = [];
  entityList: any[] = [];
  counselList: any[] = [];
  provisionTypeList: any[];

  searchOption: string = 'standard';

  constructor(private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    private sharedService: SharedService,
    private searchTools: SearchTools) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.investorId = params["id"];
      this.criteria = new StandardSearchRequest('All', null, this.investorId);
      this.showSearch = false;
      this.searchOption = 'standard';
      this.provisions = [];
      this.loadPage();
    });
  }

  onClick(event) {

    if (this.originalRows != null && event.eventPhase === 3 && event.path && (event.path[0].tagName === "DIV" || event.path[0].tagName === "TD")) {
      this.onEditSave();
    }
  }

  loadPage() {
    this.showConfirmDialog = false;
    this.deleteRow = null;
    this.sideLetterUploaderFundInvestor = null;
    this.originalRows = null;

    this.isAllSelected = false;

    this.editingRowKeys = {};
    this.editingInvestorDetails = false;
    this.availableFunds = [];

    this.adding = false;
    this.addFundMenuItem.disabled = false;
    this.showViewMoreProvisions = false;
    this.showViewMoreSideLetters = false;

    this.getInvestorDetails();
    this.getFundInvestors();
    this.getFavInvestors();
    this.getRecentInvestors();
  }

  resetRows() {
    this.loadPage();
  }

  getInvestorDetails() {
    this.http.get(ServiceConstants.InvestorApiUrl + '/' + this.investorId).subscribe(result => {
      this.investorDetails = result;
      this.originalInvestorDetails = JSON.stringify(result);
      this.http.get(ServiceConstants.InvestorApiUrl + '/UpdateLastAccessedDate/' + this.investorId).subscribe(() => { });
    });
  }

  investorDetailsOnKeyUp(event) {
    if (event.keyCode !== 9
      && event.keyCode !== 16
      && event.keyCode !== 37
      && event.keyCode !== 38
      && event.keyCode !== 39
      && event.keyCode !== 40) {
      this.editingInvestorDetails = true;
    }
    if (event.keyCode === 13) {
      //save
      this.saveInvestorDetails();
    }
    if (event.keyCode === 27) {
      //cancel
      this.cancelEditInvestorDetails();
    }
  }

  editInvestorDetails() {
    this.editingInvestorDetails = true;
  }

  saveInvestorDetails() {
    this.http.put(ServiceConstants.InvestorApiUrl, this.investorDetails, true).subscribe(() => {
      this.loadPage();
    });
  }


  cancelEditInvestorDetails() {
    this.investorDetails = JSON.parse(this.originalInvestorDetails);
    this.editingInvestorDetails = false;
  }

  onInvestorFavorite(investor) {
    this.http.get(ServiceConstants.InvestorApiUrl + '/UpdateIsFavorite/' + investor.id + '/true').subscribe(() => {
      this.loadPage();
    });
  }

  onInvestorUnfavorite(investor) {
    this.http.get(ServiceConstants.InvestorApiUrl + '/UpdateIsFavorite/' + investor.id + '/false').subscribe(() => {
      this.loadPage();
    });
  }


  getFavInvestors() {
    this.http.get(ServiceConstants.InvestorApiUrl + '/GetFavoriteInvestors/3').subscribe(results => {
      this.favInvestors = results;
    });
  }

  getRecentInvestors() {
    this.http.get(ServiceConstants.InvestorApiUrl + '/GetRecentInvestors/3').subscribe(results => {
      this.recentlyViewedInvestor = results;
    });
  }

  getFundInvestors() {
    this.http.get(ServiceConstants.FundInvestorApiUrl + '/GetListByInvestor/' + this.investorId).subscribe(
      results => {
        this.rows = results;
        this.editingRowKeys = {};
        this.setState();
      });
  }

  selectFundInvestor() {
    this.setState();
  }

  selectAllFundInvestors(event) {
    this.rows.forEach(item => {
      item.isSelected = event.target.checked;
    });
    this.setState();
  }

  setState() {
    let selectedCount = this.rows.filter(r => r.isSelected).length;
    this.tagProvisionsMenuItem.disabled = selectedCount === 0;
    this.batchDownloadMenuItem.url = "/api/fundInvestor/BatchDownload?ids=" + this.rows.filter(r => r.isSelected).map(r => r.id).join(',');
    this.isAllSelected = selectedCount === this.rows.length;
  }

  //menu item handlers

  advancedSearch() {

  }

  tagProvisions() {
    this.sharedService.setSelectedFundInvestorIds(this.rows.filter(r => r.isSelected).map(r => r.id));
    this.router.navigate(['/provision']);
  }

  //helper for file uploads
  getFormData(fileInput) {
    const formData = new FormData();
    for (let file of fileInput.files) {
      formData.append(file.name, file);
    }
    fileInput.value = null;
    return formData;
  }

  uploadBatch() {
    if (this.batchFileInput.files.length === 0) {
      return;
    }
    this.http.post(ServiceConstants.FundInvestorApiUrl + '/InvestorBatchUpload/' + this.investorId, this.getFormData(this.batchFileInput)).subscribe(() => {
      this.loadPage();
    });

  }

  addFund() {
    this.adding = true;
    this.addFundMenuItem.disabled = true;
    this.editingRowKeys = { '0': true };
    let newFundInvestor = {
      id: 0,
      investorId: +this.investorId,
      fund: {}
    };
    this.rows.unshift(newFundInvestor);
  }

  //row action handlers
  fundSearch(event) {

    this.http.get(ServiceConstants.FundApiUrl + '/Search/' + event.query).subscribe(results => {
      this.availableFunds = results;
    });
  }

  fundOnBlur(fundInvestor) {
    if (this.availableFunds.length > 0) {
      this.selectFund(this.availableFunds[0], fundInvestor);
    } else if (typeof fundInvestor.fund === 'string') {
      fundInvestor.fundName = fundInvestor.fund;
    }
  }

  fundOnSelect(fund, fundInvestor) {
    this.selectFund(fund, fundInvestor);
    this.availableFunds = [];
  }

  selectFund(fund, fundInvestor) {
    fundInvestor.fund = fund;
    fundInvestor.fundId = fund.id;
    fundInvestor.fundName = fund.name;
    fundInvestor.fundSponsorName = fund.sponsorName;
    fundInvestor.fundBusinessUnitName = fund.businessUnitName;
    fundInvestor.fundStrategyName = fund.strategyName;
    fundInvestor.fundSize = fund.size;
    fundInvestor.fundYear = fund.year;
  }

  onUploadSideLetterClick(rowData) {
    this.sideLetterUploaderFundInvestor = rowData;
    this.sideLetterFileInput.click();
  }

  inputOnKeyUp(event) {
    //on enter save rows
    if (event.keyCode === 13) {
      this.onEditSave();
    }
    //on esc cancel rows
    else if (event.keyCode === 27) {
      this.onEditCancel();
    }
  }

  fundOnKeyUp(event, fundInvestor) {
    if (fundInvestor.fund === "") {
      this.availableFunds = [];
    }
    //on enter save rows
    if (event.keyCode === 13) {

      if (this.availableFunds.length > 0) {
        this.selectFund(this.availableFunds[0], fundInvestor);
      } else if (typeof fundInvestor.fund === 'string') {
        fundInvestor.fundName = fundInvestor.fund;
      }

      this.onEditSave();
    }
    //on esc cancel rows
    else if (event.keyCode === 27) {
      this.onEditCancel();
    }
  }


  uploadSideLetter() {
    if (this.sideLetterFileInput.files.length === 0) {
      return;
    }
    this.http.post(ServiceConstants.FundInvestorApiUrl + '/UploadSideLetter/' + this.sideLetterUploaderFundInvestor.id, this.getFormData(this.sideLetterFileInput)).subscribe(() => {
      this.getFundInvestors();
    });
  }


  onRemoveSideLetter(item) {
    const url = ServiceConstants.FundInvestorApiUrl + '/RemoveSideLetter/' + item.id;
    this.http.del(url).subscribe(() => {
      this.loadPage();
    });
  }

  onRowTagProvisions(rowData) {
    this.sharedService.setSelectedFundInvestorIds([rowData.id]);
    this.router.navigate(['/provision']);
  }

  onDelete(id) {
    this.http.del(ServiceConstants.FundInvestorApiUrl + '/' + id).subscribe(
      () => this.getFundInvestors()
    );
  }

  onEditInit() {

    event.stopPropagation();
    this.addFundMenuItem.disabled = true;

    // cancel the add row
    if (this.adding) {
      this.rows.splice(0, 1);
      this.adding = false;
    }
    // save a copy of the rows
    this.originalRows = {};
    this.rows.forEach(row => {
      row.fund = {
        id: row.fundId,
        name: row.fundName,
        sponsorName: row.sponsorName,
        strategyName: row.strategyName,
        businessUnitName: row.businessUnitName,
        year: row.year,
        size: row.size
      };
      this.originalRows[row.id] = JSON.stringify(row);
    });


    // set the edit mode state
    const editingRowKeys = {};
    for (var i = 0; i < this.rows.length; i++) {
      editingRowKeys[this.rows[i].id] = true;
    }
    this.editingRowKeys = editingRowKeys;
  }

  onEditCancel() {
    this.addFundMenuItem.disabled = false;
    if (this.adding) {
      this.rows.splice(0, 1);
      this.adding = false;
    } else {
      this.rows = [];
      for (var item in this.originalRows) {
        if (this.originalRows.hasOwnProperty(item)) {
          this.rows.push(JSON.parse(this.originalRows[item]));
        }
      }
      this.originalRows = null;
      this.editingRowKeys = {};
    }
  }


  onEditSave() {
    let changes = [];
    if (this.adding) {
      changes.push(this.rows[0]);
    } else {
      this.rows.forEach(row => {
        if (JSON.stringify(row) !== this.originalRows[row.id]) {
          changes.push(row);
        }
      });
    }
    this.http.post(ServiceConstants.FundInvestorApiUrl + '/SaveAll/', changes).subscribe(() => {
      this.loadPage();
    });
  }

  onRowDelete(rowData) {
    this.showConfirmDialog = true;
    this.deleteRow = rowData;
  }

  onConfirmDeleteClick(confirm) {
    this.showConfirmDialog = false;
    if (confirm) {
      const item = this.deleteRow;
      if (item) {
        this.http.del(ServiceConstants.FundInvestorApiUrl + '/' + item.id).subscribe(() => {
          this.loadPage();
        });
      } else {
        var ids = this.rows.filter(r => r.isSelected).map(r => r.id);
        this.http.post(ServiceConstants.FundInvestorApiUrl + '/BatchDelete', ids).subscribe(() => {
          this.loadPage();
        });
      }
    }
  }

  batchDelete() {
    this.showConfirmDialog = true;
    this.deleteRow = null;
  }

  customSort(event: SortEvent) {
    if (event.data.length > 0) {
      const first = event.data[0];
      if (this.adding) {
        event.data.splice(0, 1);
      }

      event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result;

        if (value1 == null && value2 != null)
          result = -1;
        else if (value1 != null && value2 == null)
          result = 1;
        else if (value1 == null && value2 == null)
          result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
          result = value1.localeCompare(value2);
        else
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
      });

      if (this.adding) {
        event.data.unshift(first);
      }
    }
  }



  //  search logic


  showSearchPanel() {
    this.showSearch = !this.showSearch;
    this.clear();
    if (this.showSearch) {

      setTimeout(() => {
        var search = document.getElementById('searchInput');
        if (search) {
          search.focus();
        }
      });
    } else {
      this.searchOption = 'standard';
      this.loadPage();
    }
  }

  clear() {
    this.provisions = [];
    this.criteria = new StandardSearchRequest('All', null, this.investorId);
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


  searchEntityOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }

  searchSponsorOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }


  searchBusinessUnitOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }


  searchStrategyOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }


  searchYearsOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }

  searchCounselOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }
  provisions: any[];

  getSearchResults() {
    if (this.searchOption === 'precedent') {
      this.provisions = [];
      if (this.criteria.targetText && this.criteria.targetText.length > 0) {
        this.sharedService.setProgressBarVisibility(true);
        this.http.post(ServiceConstants.SearchApiUrl + '/PrecedentSearch', this.criteria).subscribe((results) => {
          results.sort((a, b) => {
            return parseFloat(b.matchScore) - parseFloat(a.matchScore);
          });
          this.sharedService.setProgressBarVisibility(false);
          this.provisions = results;
        });
      }
    } else {
      this.criteria.sideLetterSearchLimit = 10;
      this.criteria.provisionSearchLimit = 10;
      this.http.post(ServiceConstants.SearchApiUrl + '/StandardSearch/', this.criteria).subscribe((results) => {

        this.rows = results.sideLetterRows;
        this.showViewMoreSideLetters = this.rows.length === this.criteria.sideLetterSearchLimit;
        this.provisions = results.provisionRows;
        this.showViewMoreProvisions = this.provisions.length === this.criteria.provisionSearchLimit;

        setTimeout(() => {
          this.highlight();
        });
      });
    }
  }

  getMoreResults(searchCategory: string) {
    let url = '';
    switch (searchCategory) {
      case 'SideLetter':
        url = '/GetSideLetterResults/';
        this.criteria.sideLetterSearchLimit = this.criteria.sideLetterSearchLimit + 10;
        break;
      case 'Provision':
        url = '/GetProvisionResults/';
        this.criteria.provisionSearchLimit = this.criteria.provisionSearchLimit + 10;
        break;
    }
    this.http.post(ServiceConstants.SearchApiUrl + url, this.criteria).subscribe((results) => {
      switch (searchCategory) {
        case 'SideLetter':
          this.rows = results;
          this.showViewMoreSideLetters = results.length === this.criteria.sideLetterSearchLimit;
          break;
        case 'Provision':
          this.provisions = results;
          this.showViewMoreProvisions = results.length === this.criteria.provisionSearchLimit;
          break;
      }
      setTimeout(() => {
        this.highlight();
      });
    });
  }

  highlight() {
    this.searchTools.highlight(this.http, this.criteria.targetText, (this.elementRef.nativeElement as any) as HTMLElement);
  }

  reset() {
    this.criteria = new StandardSearchRequest();
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


