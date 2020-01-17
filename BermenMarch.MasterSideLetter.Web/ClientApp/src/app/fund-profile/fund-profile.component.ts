import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService, SharedService } from '../../app-common/services';
import { ServiceConstants } from '../../app-common/constants/service.constant';
import { Fund } from '../../app-common/models/fund';
import { ActivatedRoute, Router } from '@angular/router';
import { FundInvestor } from '../../app-common/models/fundInvestor';
import { SortEvent } from 'primeng/primeng';
import { MenuItem } from 'primeng/api';
import { StandardSearchRequest } from '../../app-common/models/standard-search-request';
import { SearchTools } from '../../app-common/services/search-tools';
@Component({
  selector: 'app-fund-profile',
  templateUrl: './fund-profile.component.html',
  styleUrls: ['./fund-profile.component.scss']
})
export class FundProfileComponent implements OnInit {

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
    { field: 'entity', header: 'Entity', headerClass: 'text-left', width: '14rem', type: "text" },
    { field: 'commitment', header: 'Commitment', headerClass: 'text-left', width: '8rem', type: "number" },
    { field: 'counsel', header: 'Counsel', headerClass: 'text-left', width: '10rem', type: "text" },
    { field: 'notes', header: 'Notes', headerClass: 'text-left', width: '10rem', type: "text" }
  ];

  generateMslMenuItem: MenuItem = { label: 'Generate MSL', disabled: true };
  tagProvisionsMenuItem: MenuItem = { label: 'Tag Provisions', disabled: true, command: () => { this.tagProvisions(); } };
  uploadMslMenuItem: MenuItem = { label: 'Upload MSL', command: () => { this.mslFileInput.click(); } };
  downloadMslMenuItem: MenuItem = { label: 'Download MSL' };
  removeMslMenuItem: MenuItem = { label: 'Remove MSL', command: () => { this.removeMsl(); } };
  mslSubMenuItem: MenuItem = {
    label: 'MSL',
    items: [this.uploadMslMenuItem, this.downloadMslMenuItem, this.removeMslMenuItem]
  };

  uploadMfnMenuItem: MenuItem = { label: 'Upload MFN', command: () => { this.mfnFileInput.click(); } };
  downloadMfnMenuItem: MenuItem = { label: 'Download MFN' };
  removeMfnMenuItem: MenuItem = { label: 'Remove MFN', command: () => { this.removeMfn(); } };
  mfnSubMenuItem: MenuItem = {
    label: 'MFN',
    items: [this.uploadMfnMenuItem, this.downloadMfnMenuItem, this.removeMfnMenuItem]
  };

  batchUploadMenuItem: MenuItem = { label: 'Batch Upload', command: () => { this.batchFileInput.click(); } };
  batchDownloadMenuItem: MenuItem = { label: 'Batch Download' };
  batchDeleteMenuItem: MenuItem = { label: 'Batch Delete', command: () => { this.batchDelete(); } };
  addInvestorMenuItem: MenuItem = { label: 'Add Investor', icon: 'fa fa-plus-circle', styleClass: 'text-highlight-dark', command: () => { this.addInvestor(); } };



  menuBarItems: MenuItem[] = [
    this.generateMslMenuItem,
    { separator: true },
    this.tagProvisionsMenuItem,
    { separator: true },
    this.mslSubMenuItem,
    { separator: true },
    this.mfnSubMenuItem,
    { separator: true },
    this.batchUploadMenuItem,
    { separator: true },
    this.batchDownloadMenuItem,
    { separator: true },
    this.batchDeleteMenuItem,
    { separator: true },
    this.addInvestorMenuItem
  ];

  collapsedMenuBarItems: MenuItem[] = [
    {
      icon: 'fa fa-bars',
      styleClass: 'collapsed-menu',
      items: [
        this.generateMslMenuItem,
        this.tagProvisionsMenuItem,
        { separator: true },
        this.uploadMslMenuItem,
        this.downloadMslMenuItem,
        this.removeMslMenuItem,
        { separator: true },
        this.uploadMfnMenuItem,
        this.downloadMfnMenuItem,
        this.removeMfnMenuItem,
        { separator: true },
        this.batchUploadMenuItem,
        { separator: true },
        this.batchDownloadMenuItem,
        { separator: true },
        this.batchDeleteMenuItem,
        { separator: true },
        this.addInvestorMenuItem
      ]
    }
  ];

  fundId: number;
  availableInvestors: any[];
  availableInvestorTypeInvestors: any[];
  fundDetails: Fund = new Fund();
  originalFundDetails: any;
  favFunds: Fund[] = [];
  recentlyViewedFund: Fund[] = [];
  rows: any[] = [];
  isAllSelected: boolean;
  adding: boolean;
  dataKey = 'id';
  defaultSortField = 'investorName';
  defaultSortOrder = 1;
  editingRowKeys: any = {};
  showConfirmDialog: boolean;
  deleteRow: FundInvestor;
  confirmDialogMessage = 'Remove Investor(s) from Fund?';
  sideLetterUploaderFundInvestor: FundInvestor;
  originalRows: any;
  editingFundDetails: boolean = false;
  // search vars
  showViewMoreSideLetters: boolean = false;
  showViewMoreProvisions: boolean = false;
  targetText: string;
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
  constructor(private  elementRef: ElementRef, private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    private sharedService: SharedService,
    private searchTools: SearchTools) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.fundId = params["id"];
      this.criteria = new StandardSearchRequest('All', this.fundId);
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
    this.editingFundDetails = false;
    this.availableInvestors = [];
    this.availableInvestorTypeInvestors = [];
    this.adding = false;
    this.addInvestorMenuItem.disabled = false;
    this.showViewMoreProvisions = false;
    this.showViewMoreSideLetters = false;

    this.getFundDetails();
    this.getFundInvestors();
    this.getFavFunds();
    this.getRecentFunds();
  }


  getFundDetails() {
    this.http.get(ServiceConstants.FundApiUrl + '/' + this.fundId).subscribe(result => {
      this.fundDetails = result;
      this.originalFundDetails = JSON.stringify(result);
      this.downloadMslMenuItem.url = "/api/fund/downloadMsl/" + this.fundId;
      this.downloadMslMenuItem.disabled = this.removeMslMenuItem.disabled = this.fundDetails.mslFileName == null;
      this.downloadMfnMenuItem.url = "/api/fund/downloadMfn/" + this.fundId;
      this.downloadMfnMenuItem.disabled = this.removeMfnMenuItem.disabled = this.fundDetails.mfnFileName == null;
      this.http.get(ServiceConstants.FundApiUrl + '/UpdateLastAccessedDate/' + this.fundId).subscribe(() => { });
    });
  }


  fundDetailsOnKeyUp(event) {
    if (event.keyCode !== 9
      && event.keyCode !== 16
      && event.keyCode !== 37
      && event.keyCode !== 38
      && event.keyCode !== 39
      && event.keyCode !== 40) {
      this.editingFundDetails = true;
    }
    if (event.keyCode === 13) {
      //save
      this.saveFundDetails();
    }
    if (event.keyCode === 27) {
      //cancel
      this.cancelEditFundDetails();
    }
  }

  editFundDetails() {
    this.editingFundDetails = true;
  }

  saveFundDetails() {
    this.http.put(ServiceConstants.FundApiUrl, this.fundDetails, true).subscribe(() => {
      this.loadPage();
    });
  }


  cancelEditFundDetails() {
    this.fundDetails = JSON.parse(this.originalFundDetails);
    this.editingFundDetails = false;
  }

  onFundFavorite(fund) {
    this.http.get(ServiceConstants.FundApiUrl + '/UpdateIsFavorite/' + fund.id + '/true').subscribe(() => {
      this.loadPage();
    });
  }

  onFundUnfavorite(fund) {
    this.http.get(ServiceConstants.FundApiUrl + '/UpdateIsFavorite/' + fund.id + '/false').subscribe(() => {
      this.loadPage();
    });
  }

  getFavFunds() {
    this.http.get(ServiceConstants.FundApiUrl + '/GetFavoriteFunds/3').subscribe(results => {
      this.favFunds = results;
    });
  }

  getRecentFunds() {
    this.http.get(ServiceConstants.FundApiUrl + '/GetRecentFunds/3').subscribe(results => {
      this.recentlyViewedFund = results;
    });
  }

  getFundInvestors() {
    this.http.get(ServiceConstants.FundInvestorApiUrl + '/GetListByFund/' + this.fundId).subscribe(
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
    this.generateMslMenuItem.disabled = this.tagProvisionsMenuItem.disabled = this.batchDeleteMenuItem.disabled = this.batchDownloadMenuItem.disabled = selectedCount === 0;
    this.batchDownloadMenuItem.url = "/api/fundInvestor/BatchDownload?ids=" + this.rows.filter(r => r.isSelected).map(r => r.id).join(',');
    this.generateMslMenuItem.url = "/api/fundInvestor/GenerateMasterSideLetter?fundId=" + this.fundId + "&fundInvestorIds=" + this.rows.filter(r => r.isSelected).map(r => r.id).join(',');
    this.isAllSelected = selectedCount === this.rows.length;
  }

  // menu item handlers
  advancedSearch() {

  }

  tagProvisions() {
    this.sharedService.setSelectedFundInvestorIds(this.rows.filter(r => r.isSelected).map(r => r.id));
    this.router.navigate(['/provision']);
  }

  // helper for file uploads
  getFormData(fileInput) {
    const formData = new FormData();
    for (let file of fileInput.files) {
      formData.append(file.name, file);
    }
    fileInput.value = null;
    return formData;
  }

  public uploadMsl() {
    if (this.mslFileInput.files.length === 0) {
      return;
    }

    this.http.post(ServiceConstants.FundApiUrl + '/UploadMsl/' + this.fundId, this.getFormData(this.mslFileInput)).subscribe(() => {
      this.loadPage();
    });
  }

  removeMsl() {
    this.http.del(ServiceConstants.FundApiUrl + '/RemoveMsl/' + this.fundId).subscribe(() => {
      this.loadPage();
    });

  }



  uploadMfn() {
    if (this.mfnFileInput.files.length === 0) {
      return;
    }
    this.http.post(ServiceConstants.FundApiUrl + '/UploadMfn/' + this.fundId, this.getFormData(this.mfnFileInput)).subscribe(() => {
      this.loadPage();
    });
  }

  removeMfn() {
    this.http.del(ServiceConstants.FundApiUrl + '/RemoveMfn/' + this.fundId).subscribe(() => {
      this.loadPage();
    });
  }

  uploadBatch() {
    if (this.batchFileInput.files.length === 0) {
      return;
    }
    this.http.post(ServiceConstants.FundInvestorApiUrl + '/FundBatchUpload/' + this.fundId, this.getFormData(this.batchFileInput)).subscribe(() => {
      this.loadPage();
    });

  }

  addInvestor() {
    this.adding = true;
    this.addInvestorMenuItem.disabled = true;
    this.editingRowKeys = { '0': true };
    let newFundInvestor = {
      id: 0,
      fundId: +this.fundId,
      investor: {
      },
      investorTypeInvestor: {
      }
    };

    this.rows.unshift(newFundInvestor);
  }

  // row action handlers
  investorSearch(event) {

    this.http.get(ServiceConstants.InvestorApiUrl + '/Search/' + event.query).subscribe(results => {
      this.availableInvestors = results;

    });
  }

  investorTypeSearch(event) {
    this.http.get(ServiceConstants.InvestorApiUrl + '/InvestorTypeSearch/' + event.query).subscribe(results => {
      this.availableInvestorTypeInvestors = results;
    });
  }


  investorOnBlur(fundInvestor) {
    //if (this.availableInvestors.length > 0) {
    //  this.selectInvestor(this.availableInvestors[0], fundInvestor);
    //} else
    if (typeof fundInvestor.investor === 'string') {
      fundInvestor.investorName = fundInvestor.investor;
    }
  }

  investorTypeOnBlur(fundInvestor) {
    //if (this.availableInvestorTypeInvestors.length > 0) {
    //  this.selectInvestor(this.availableInvestorTypeInvestors[0], fundInvestor);
    //} else
    if (typeof fundInvestor.investorTypeInvestor === 'string') {
      fundInvestor.investorType = fundInvestor.investorTypeInvestor;
    }
  }

  investorOnSelect(investor, fundInvestor) {
    this.selectInvestor(investor, fundInvestor);
    this.availableInvestors = [];
  }

  investorTypeOnSelect(investor, fundInvestor) {
    this.selectInvestor(investor, fundInvestor);
    this.availableInvestorTypeInvestors = [];
  }

  selectInvestor(investor, fundInvestor) {
    fundInvestor.investor = investor;
    fundInvestor.investorTypeInvestor = investor;
    fundInvestor.investorId = investor.id;
    fundInvestor.investorName = investor.name;
    fundInvestor.investorType = investor.investorType;
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

  investorOnKeyUp(event, fundInvestor) {
    if (fundInvestor.investor === "") {
      this.availableInvestors = [];
    }
    //on enter save rows
    if (event.keyCode === 13) {

      if (this.availableInvestors.length > 0) {
        this.selectInvestor(this.availableInvestors[0], fundInvestor);
      } else if (typeof fundInvestor.investor === 'string') {
        fundInvestor.investorName = fundInvestor.investor;
      }

      this.onEditSave();
    }
    //on esc cancel rows
    else if (event.keyCode === 27) {
      this.onEditCancel();
    }
  }

  investorTypeOnKeyUp(event, fundInvestor) {
    if (fundInvestor.investorTypeInvestor === "") {
      this.availableInvestorTypeInvestors = [];
    }
    //on enter save rows
    if (event.keyCode === 13) {
      if (this.availableInvestorTypeInvestors.length > 0 && (!fundInvestor.investorName || fundInvestor.investorName.length===0)) {
        this.selectInvestor(this.availableInvestorTypeInvestors[0], fundInvestor);
      } else if (typeof fundInvestor.investorTypeInvestor === 'string') {
        fundInvestor.investorType = fundInvestor.investorTypeInvestor;
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
    this.addInvestorMenuItem.disabled = true;

    // cancel the add row
    if (this.adding) {
      this.rows.splice(0, 1);
      this.adding = false;
    }
    // save a copy of the rows
    this.originalRows = {};
    this.rows.forEach(row => {
      row.investor = { id: row.investorId, name: row.investorName, investorType: row.investorType };
      row.investorTypeInvestor = { id: row.investorId, name: row.investorName, investorType: row.investorType };
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
    this.addInvestorMenuItem.disabled = false;
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
    this.criteria = new StandardSearchRequest('All', this.fundId);
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

  searchInvestorTypeOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }

  searchEntityOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }

  searchCounselOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }

  provisions : any[];

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


