import { Component,Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from '../../app-common/services/http.service';
import { SortEvent } from "primeng/components/common/api";
import { FundsService } from '../../app-common/services/funds.service';
import { ServiceConstants } from '../../app-common/constants/service.constant';
import { Fund } from '../../app-common/models/fund';
import { MenuItem } from 'primeng/api';
import { StandardSearchRequest } from '../../app-common/models/standard-search-request';
import { SearchTools } from '../../app-common/services/search-tools';



@Component({
  selector: 'app-fund-list',
  templateUrl: './fund-list.component.html'
})
export class FundListComponent implements OnInit {
  @Input()
  pageTitle: string;
  @Input()
  mode: string;

  @Input()
  rows: any[];




  @ViewChild("mslUploader", { static: false }) mslUploader: ElementRef;

  get mslFileInput(): HTMLInputElement {
    return ((this.mslUploader.nativeElement) as any) as HTMLInputElement;
  }

  @ViewChild("mfnUploader", { static: false })
  mfnUploader: ElementRef;

  get mfnFileInput(): HTMLInputElement {
    return ((this.mfnUploader.nativeElement) as any) as HTMLInputElement;
  }


  cols: any[] = [
    { field: 'name', header: 'Name', width: '10rem', headerClass: 'text-center', type: 'text' },
    { field: 'sponsorName', header: 'Sponsor', width: '10rem', headerClass: 'text-left', type: 'text' },
    { field: 'businessUnitName', header: 'Business Unit', width: '10rem', headerClass: 'text-left', type: 'text' },
    { field: 'year', header: 'Year', width: '8rem', headerClass: 'text-center', type: 'number' },
    { field: 'size', header: 'Size', width: '8rem', headerClass: 'text-center', type: 'number' },
    { field: 'strategyName', header: 'Strategy', width: '10rem', headerClass: 'text-left', type: 'text' }
  ];


  addFundMenuItem: MenuItem = { label: 'Add Fund', icon: 'fa fa-plus-circle', styleClass: 'text-highlight-dark', command: (event) => {
      event.originalEvent.stopPropagation();
      this.onRowAddInit();
  } };
  menuBarItems: MenuItem[] = [
    this.addFundMenuItem
  ];

  adding: boolean;
  showConfirmDialog: boolean;
  deleteRow: any = {};
  editingRowKeys: any = {};
  confirmDialogMessage = 'Are you sure you want to delete this Fund?';
  mslUploaderFund: Fund;
  mfnUploaderFund: Fund;
  showTitle: boolean = true;
  showAddButton: boolean = true;

  // search vars
  criteria: StandardSearchRequest = new StandardSearchRequest('Fund');
  showViewMore: boolean = false;
  showFundListSearch: boolean;
  // search filters
  fundList: any[] = [];
  investorList: any[] = [];
  sponsorList: any[] = [];
  businessUnitList: any[] = [];
  strategyList: any[] = [];
  investorTypeList: any[] = [];
  entityList: any[] = [];
    counselList: any[] = [];
    provisionTypeList: any[];


  constructor(private elementRef: ElementRef, private http: HttpService, private fundsService: FundsService, private searchTools:SearchTools) {
    this.fundsService.fundsChanged.subscribe(() => {
      this.loadPage();
    });
  }

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.adding = false;
    this.addFundMenuItem.disabled = false;
    let url = ServiceConstants.FundApiUrl;

    switch (this.mode) {
    case 'favorite':
      url += '/GetFavoriteFunds';
      break;
    case 'recent':
      url += '/GetRecentFunds/5';
      break;
    case 'search':
      url = null;
      this.showTitle = this.showAddButton  = false;
      break;
    }
    if (url) {
      this.http.get(url).subscribe((result) => {
        this.rows = result;
      });
    }
  }


  showFunds() {
    this.showTitle = this.showAddButton = this.rows.length > 0;
  }


  onRowAddInit() {
    this.adding = true;
    this.addFundMenuItem.disabled = true;
    this.editingRowKeys = { "0": true };
    this.rows.unshift({
      id: 0,
      name: ""
    });
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

  //MSL
  onUploadMslClick(rowData) {
    this.mslUploaderFund = rowData;
    this.mslFileInput.click();
  }

  uploadMsl() {
    if (this.mslFileInput.files.length === 0) {
      return;
    }
    this.http.post(ServiceConstants.FundApiUrl + '/UploadMsl/' + this.mslUploaderFund.id, this.getFormData(this.mslFileInput)).subscribe(() => {
      this.fundsService.fundsChanged.emit();
    });
  }

  removeMsl(rowData) {
    this.http.del(ServiceConstants.FundApiUrl + '/RemoveMsl/' + rowData.id).subscribe(() => {
      this.fundsService.fundsChanged.emit();
    });
  }

  //MFN
  onUploadMfnClick(rowData) {
    this.mfnUploaderFund = rowData;
    this.mfnFileInput.click();
  }

  uploadMfn() {
    if (this.mfnFileInput.files.length === 0) {
      return;
    }
    this.http.post(ServiceConstants.FundApiUrl + '/UploadMfn/' + this.mfnUploaderFund.id, this.getFormData(this.mfnFileInput)).subscribe(() => {
      this.fundsService.fundsChanged.emit();
    });
  }

  removeMfn(rowData) {
    this.http.del(ServiceConstants.FundApiUrl + '/RemoveMfn/' + rowData.id).subscribe(() => {
      this.fundsService.fundsChanged.emit();
    });
  }

  originalEditRow: any;


  inputOnKeyUp(event, rowData, rowIndex) {
    //on enter save rows
    if (event.keyCode === 13) {
      this.onRowEditSave(rowData);
      delete this.editingRowKeys[rowData.id];
    }
    //on esc cancel rows
    else if (event.keyCode === 27) {
      this.onRowEditCancel(rowIndex);
      delete this.editingRowKeys[rowData.id];
    }
  }

  onRowEditInit(rowData) {
    //save any open items
    for (let editId in this.editingRowKeys) {
      if (this.editingRowKeys.hasOwnProperty(editId)) {
        const editRow = this.rows.find(r => String(r.id) === editId);
        this.onRowEditSave(editRow, false);
      }
    }

    this.addFundMenuItem.disabled = true;
    //cancel the add row
    if (this.adding) {
      this.rows.splice(0, 1);
      this.adding = false;
    }
    //save a copy of the row
    this.originalEditRow = JSON.parse(JSON.stringify(rowData));

    //set the edit mode state
    const editingRowKeys = {};
    editingRowKeys[rowData.id] = true;
    this.editingRowKeys = editingRowKeys;

  }

  onRowEditCancel(rowIndex) {
    this.addFundMenuItem.disabled = false;
    if (this.adding) {
      this.rows.splice(0, 1);
      this.adding = false;
    } else {
      this.rows[rowIndex] = this.originalEditRow;
    }
  }


  sponsorNameOnClick(event, rowData) {
    event.stopPropagation();
    this.showFundListSearch = true;
    this.clear();
    this.criteria.sponsorValues = [rowData.sponsorName];
    this.getSearchResults();
  }

  businessUnitNameOnClick(event, rowData) {
    event.stopPropagation();
    this.showFundListSearch = true;
    this.clear();
    this.criteria.sponsorValues = [rowData.sponsorName];
    this.criteria.businessUnitValues = [rowData.businessUnitName];
    this.getSearchResults();
  }

  trySaveEdits() {
    for (let editingRowKey in this.editingRowKeys) {
      if (this.editingRowKeys.hasOwnProperty(editingRowKey)) {
        const editRow = this.rows.find(r => String(r.id) === editingRowKey);
        if (editRow != undefined) {
          this.onRowEditSave(editRow);
        }
      }
    }
  }

  onRowEditSave(rowData, reload = true) {
    if (this.editingRowKeys.hasOwnProperty(rowData.id)) {
      delete this.editingRowKeys[rowData.id];
    }
    if (this.adding) {
      let url = ServiceConstants.FundApiUrl;
      if (this.mode === 'favorite') {
        url += '/CreateAndFavorite';
      }
      this.http.post(url, rowData).subscribe(() => {
        if (reload) {
          this.fundsService.fundsChanged.emit();
        }
      });
    } else {
      this.http.put(ServiceConstants.FundApiUrl, rowData, true).subscribe(() => {
        if (reload) {
          this.fundsService.fundsChanged.emit();
        }
      });
    }
  }

  onRowDelete(rowData) {
    this.showConfirmDialog = true;
    this.deleteRow = rowData;
  }

  onRowFavorite(rowData) {
    this.http.get(ServiceConstants.FundApiUrl + '/UpdateIsFavorite/' + rowData.id + '/true').subscribe(() => {
      this.fundsService.fundsChanged.emit();
    });
  }

  onRowUnfavorite(rowData) {
    this.http.get(ServiceConstants.FundApiUrl + '/UpdateIsFavorite/' + rowData.id + '/false').subscribe(() => {
      this.fundsService.fundsChanged.emit();
    });
  }


  confirmDeleteClick(confirm: boolean) {
    this.showConfirmDialog = false;
    if (confirm) {
      const item = this.deleteRow;
      this.http.del(ServiceConstants.FundApiUrl + "/" + item.id).subscribe(() => {
        this.fundsService.fundsChanged.emit();
      });
    }
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
    this.showFundListSearch = !this.showFundListSearch;
    this.clear();
    if (this.showFundListSearch) {
      setTimeout(() => {
        const search = document.getElementById('searchInput');
        if (search) {
          search.focus();
        }
      });
    } else {
      this.loadPage();
    }
  }

  clear() {

    this.criteria = new StandardSearchRequest('Fund');
  }

  getFilterContents(event, filterName) {
    const body = {
      targetText: event.query,
      filterType: filterName,
      filterLimit: 5
    };
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

  searchSponsorOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }

  searchEntityTypeOnKeyUp(event) {
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

  getSearchResults(more : boolean = false) {
    this.criteria.fundSearchLimit = more ? this.criteria.fundSearchLimit + 10 : 10;
    this.http.post(ServiceConstants.SearchApiUrl + '/GetFundResults/', this.criteria).subscribe((results) => {
      this.rows = results;
      if (this.mode !== 'search') {
        this.showViewMore = this.rows.length === this.criteria.fundSearchLimit;
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
}
