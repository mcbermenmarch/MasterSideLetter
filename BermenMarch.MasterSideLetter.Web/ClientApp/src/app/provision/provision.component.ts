import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpService } from '../../app-common/services/http.service';
import { SharedService } from '../../app-common/services';
import { ServiceConstants } from '../../app-common/constants/service.constant';
import { MenuItem } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { StandardSearchRequest } from '../../app-common/models/standard-search-request';
import { SearchTools } from '../../app-common/services/search-tools';

@Component({
  selector: 'app-provision',
  templateUrl: './provision.component.html',
  styleUrls: ['./provision.component.scss']
})
export class ProvisionComponent implements OnInit {

  fundInvestorIds: any[] = [];
  rows: any[] = [];
  fundInvestors: any[] = [];
  provisions: any [];
  isAllProvisionSelected: boolean = false;

  tagProvisionsMenuItem: MenuItem = { label: 'Inherit Types', disabled: true, command: () => { this.inheritProvisionTypes(); } };

  menuBarItems: MenuItem[] = [
    this.tagProvisionsMenuItem
  ];


  cols: any[] = [
    { field: 'content', header: 'Provision', headerClass: 'text-left', width: '100%' },
    { field: 'provisionType', header: 'Type', headerClass: 'text-left', width: '15rem' },
    { field: 'investorName', header: 'Investor', headerClass: 'text-left', width: '15rem' },
    { field: 'notes', header: 'Notes', headerClass: 'text-left', width: '15rem' }
  ];


  // search vars
  criteria: StandardSearchRequest = new StandardSearchRequest('Provision');
  showViewMore: boolean = false;
  showProvisionSearch: boolean;
  searchOption: string = 'standard';

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


  constructor(private elementRef: ElementRef, private http: HttpService, private sharedService: SharedService, private searchTools: SearchTools) {

  }

  ngOnInit() {

    this.fundInvestorIds = this.sharedService.getSelectedFundInvestorIds();
    this.criteria = new StandardSearchRequest('Provision', null, null, this.fundInvestorIds);
    this.loadPage();
  }

  provisionTypeMap = {};

  getProvisionType(row, input) {
    this.provisionTypeMap[row.id] = input;
    return row.provisionType;
  }

  loadPage() {
    this.http.post(ServiceConstants.ProvisionApiUrl + '/GetListByFundInvestors', this.fundInvestorIds).subscribe((results) => {
      this.rows = results.map((item) => {
        item.isSelected = false;
        return item;
      });
    });
  }

  selectProvision() {
    this.setState();
  }

  selectAllInvestorProvisions(event, rowData) {
    this.rows.forEach(item => {
      item.isSelected = event.target.checked;
    });
    this.isAllProvisionSelected = true;
    this.setState();
  }

  setState() {
    let selectedCount = this.rows.filter(r => r.isSelected).length;
    this.tagProvisionsMenuItem.disabled = selectedCount === 0;
  }

  advancedSearch() {

  }

  provisionTypeSearch(event, provision) {
    this.http.get(ServiceConstants.ProvisionApiUrl + '/SearchProvisionTypes/' + event.query).subscribe((results) => {
      provision.availableProvisionTypes = results;
    });
  }

  provisionTypeOnFocus(provision) {
    delete provision.availableProvisionTypes;
    if (!provision.onTypeFocus) {
      provision.originalProvisionType = provision.provisionType;
      provision.onTypeFocus = true;
    }
  }

  provisionTypeOnBlur(provision) {
    if (provision.availableProvisionTypes && provision.availableProvisionTypes.length > 0) {
      provision.provisionType = provision.availableProvisionTypes[0];
      delete provision.availableProvisionTypes;
      provision.isChanged = true;
    }
    if (provision.isProvisionTypeInherited) {
      provision.isProvisionTypeInherited = false;
      provision.isChanged = true;
    }

    if (provision.isChanged) {
      this.updateProvisionType(provision);
    }
    provision.onTypeFocus = false;
  }

  getAvailableProvisionTypes(provision) {
    if (!provision['availableProvisionTypes']) {
      provision.availableProvisionTypes = [];
    }
    return provision.availableProvisionTypes;
  }

  provisionTypeOnKeyUp(event, provision) {
    if (event.keyCode !== 9 && event.keyCode !== 16 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40) {
      provision.isChanged = true;
        if (event.keyCode === 13) {
        delete provision.availableProvisionTypes;
        this.updateProvisionType(provision);
        var index = this.rows.indexOf(provision);
        if (index < this.rows.length - 2) {
          var ac = this.provisionTypeMap[this.rows[index + 1].id] as AutoComplete;
          let el = ((ac.inputEL.nativeElement) as any) as HTMLInputElement;
          el.focus();
        }
      } else if (event.keyCode === 27) {
        provision.provisionType = provision.originalProvisionType;
        provision.isChanged = false;
      }
    }
  }

  updateProvisionType(provision) {
    if (provision.isChanged) {
      provision.isChanged = false;
      provision.isProvisionTypeInherited = false;
      this.http.put(ServiceConstants.ProvisionApiUrl, provision).subscribe(() => {
      });
    }
  }


  provisionNotesOnFocus(provision) {
    if (!provision.onNotesFocus) {
      provision.originalProvisionNotes = provision.notes;
      provision.onNotesFocus = true;
    }
  }

  provisionNotesOnBlur(provision) {
    if (provision.isChanged) {
      this.updateProvisionNotes(provision);
    }
    provision.onNotesFocus = false;
  }

  provisionNotesOnKeyUp(event, provision) {

    if (event.keyCode !== 9 && event.keyCode !== 16 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40) {
      provision.isChanged = true;
      if (event.keyCode === 13) {
        this.updateProvisionNotes(provision);
      } else if (event.keyCode === 27) {
        provision.Notes = provision.originalProvisionNotes;
        provision.isChanged = false;
      }
    }
  }

  updateProvisionNotes(provision) {
    provision.onNotesFocus = false;
    if (provision.isChanged) {
      provision.isChanged = false;
      this.http.put(ServiceConstants.ProvisionApiUrl, provision).subscribe(() => {
      });
    }
  }

  cancelUpdateProvisionNotes(provision) {
    provision.onNotesFocus = false;
    provision.Notes = provision.originalProvisionNotes;
    provision.isChanged = false;
  }

  inheritProvisionTypes() {
    const url = ServiceConstants.ProvisionApiUrl + '/InheritProvisionTypes';
    const selected = this.rows.filter(r => r.isSelected);
    const selectedIds = selected.map((r) => {
      return r.id;
    });

    this.sharedService.setProgressBarVisibility(true);
    this.http.post(url, selectedIds).subscribe(() => {
      this.sharedService.setProgressBarVisibility(false);
      this.loadPage();
    });
  }


  //  search logic
  showSearchPanel() {
    this.showProvisionSearch = !this.showProvisionSearch;
    this.clear();
    if (this.showProvisionSearch) {

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
    this.criteria = new StandardSearchRequest('Provision', null, null, this.fundInvestorIds);
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

  searchProvisionTypeOnKeyUp(event) {
    if (event.keyCode === 13) {
      this.getSearchResults();
    }
  }

  getSearchResults(more: boolean = false) {
    if (this.searchOption === 'precedent') {
      this.sharedService.setProgressBarVisibility(true);
        this.http.post(ServiceConstants.SearchApiUrl + '/PrecedentSearch', this.criteria).subscribe((results) => {
          if (results && results.length > 0) {
            results.sort((a, b) => {
              return parseFloat(b.matchScore) - parseFloat(a.matchScore);
            });
          }
          this.sharedService.setProgressBarVisibility(false);
        this.provisions = results;
      });
    } else {
      this.criteria.provisionSearchLimit = more ? this.criteria.provisionSearchLimit + 10 : 10;
      this.http.post(ServiceConstants.SearchApiUrl + '/GetProvisionResults/', this.criteria).subscribe((results) => {
        this.rows = results;
        this.showViewMore = this.rows.length === this.criteria.provisionSearchLimit;
        setTimeout(() => {
          this.highlight();
        });
      });
      this.sharedService.searchCriteriaChanged.emit(this.criteria);
    }
  }


  highlight() {
    this.searchTools.highlight(this.http, this.criteria.targetText, (this.elementRef.nativeElement as any) as HTMLElement);
  }

  reset() {
    this.criteria = new StandardSearchRequest('Provision', null, null, this.fundInvestorIds);
  }
}

