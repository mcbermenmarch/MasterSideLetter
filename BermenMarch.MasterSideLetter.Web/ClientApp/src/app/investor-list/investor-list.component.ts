import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { HttpService } from '../../app-common/services/http.service';
import { SortEvent } from "primeng/components/common/api";
import { InvestorsService } from '../../app-common/services/investors.service';
import { ServiceConstants } from '../../app-common/constants/service.constant';
import { MenuItem } from 'primeng/api';
import { StandardSearchRequest } from '../../app-common/models/standard-search-request';
import { SearchTools } from '../../app-common/services/search-tools';

@Component({
  selector: 'app-investor-list',
  templateUrl: './investor-list.component.html'
})
export class InvestorListComponent implements OnInit {

  @Input()
  pageTitle: string;
  @Input()
  mode: string;
  @Input()
  rows: any[];



  cols: any[] = [
    { field: 'name', header: 'Name', width: '10rem', headerClass: 'text-center', editable: true, type: 'text' },
    { field: 'investorType', header: 'Type', width: '10rem', headerClass: 'text-left', editable: true, type: 'text' },
    { field: 'aggregated', header: 'Aggregated $', width: '10rem', headerClass: 'text-left', editable: false, type: 'number' },
    { field: 'fundNos', header: 'No.', width: '10rem', headerClass: 'text-left', editable: false, type: 'number' }
  ];


  addInvestorMenuItem: MenuItem = { label: 'Add Investor', icon: 'fa fa-plus-circle', styleClass: 'text-highlight-dark', command: (event) => {
      event.originalEvent.stopPropagation();
      this.onRowAddInit();
  } };  
  menuBarItems: MenuItem[] = [
	this.addInvestorMenuItem
  ];

  adding: boolean;
  showConfirmDialog: boolean;
  deleteRow: any = {};
  editingRowKeys: any = {};
  confirmDialogMessage = 'Are you sure you want to delete this Investor?';
  showTitle: boolean = true;
  showAddButton: boolean = true;

  // search vars
  criteria : StandardSearchRequest = new StandardSearchRequest('Investor');
  showViewMore: boolean = false;
  showInvestorListSearch: boolean;

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


  constructor(private elementRef: ElementRef, private http: HttpService, private investorsService: InvestorsService, private searchTools: SearchTools) {
    this.investorsService.investorsChanged.subscribe(() => {
      this.loadPage();
    });
  }

  ngOnInit() {
    this.loadPage();
  }

  loadPage() {
    this.adding = false;
    this.addInvestorMenuItem.disabled = false;
    let url = ServiceConstants.InvestorApiUrl;

    switch (this.mode) {
    case 'favorite':
      url += '/GetFavoriteInvestors';
      break;
    case 'recent':
      url += '/GetRecentInvestors/5';
      break;
    case 'search':
      url = null;
      this.showTitle = this.showAddButton = false;
      break;
    }
    if (url) {
      this.http.get(url).subscribe((result) => {
        this.rows = result;
      });
    }
  }


  showInvestors() {
    this.showTitle = this.showAddButton = this.rows.length > 0;
  }



  onRowAddInit() {
    this.adding = true;
        this.addInvestorMenuItem.disabled = true;
    this.editingRowKeys = { "0": true };
    this.rows.unshift({
      id: 0,
      name: ""
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
    this.addInvestorMenuItem.disabled = true;
    
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
      this.addInvestorMenuItem.disabled = false;
    if (this.adding) {
      this.rows.splice(0, 1);
      this.adding = false;
    } else {
      this.rows[rowIndex] = this.originalEditRow;
    }
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
      let url = ServiceConstants.InvestorApiUrl;
      if (this.mode === 'favorite') {
        url += '/CreateAndFavorite';
      }
      this.http.post(url, rowData).subscribe(() => {
              if (reload) {
        this.investorsService.investorsChanged.emit();
	}
      });
    } else {
      this.http.put(ServiceConstants.InvestorApiUrl, rowData, true).subscribe(() => {
              if (reload) {
        this.investorsService.investorsChanged.emit();
	}
      });
    }
  }

  onRowDelete(rowData) {
    this.showConfirmDialog = true;
    this.deleteRow = rowData;
  }

  onRowFavorite(rowData) {
    this.http.get(ServiceConstants.InvestorApiUrl + '/UpdateIsFavorite/' + rowData.id + '/true').subscribe(() => {
      this.investorsService.investorsChanged.emit();
    });
  }

  onRowUnfavorite(rowData) {
    this.http.get(ServiceConstants.InvestorApiUrl + '/UpdateIsFavorite/' + rowData.id + '/false').subscribe(() => {
      this.investorsService.investorsChanged.emit();
    });
  }


  confirmDeleteClick(confirm: boolean) {
    this.showConfirmDialog = false;
    if (confirm) {
      const item = this.deleteRow;
      this.http.del(ServiceConstants.InvestorApiUrl + "/" + item.id).subscribe(() => {
        this.investorsService.investorsChanged.emit();
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
    this.showInvestorListSearch = !this.showInvestorListSearch;
      this.clear();
      if (this.showInvestorListSearch) {
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
    this.criteria = new StandardSearchRequest('Investor');
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

  searchInvestorTypeOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }

  investorSearchLimit = 10;
  getSearchResults(more: boolean = false) {
    this.criteria.investorSearchLimit = more ? this.criteria.investorSearchLimit + 10 : 10;
    
    this.http.post(ServiceConstants.SearchApiUrl + '/GetInvestorResults/', this.criteria).subscribe((results) => {
      this.rows = results;
      if (this.mode !== 'search') {
        this.showViewMore = this.rows.length === this.criteria.investorSearchLimit;
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
