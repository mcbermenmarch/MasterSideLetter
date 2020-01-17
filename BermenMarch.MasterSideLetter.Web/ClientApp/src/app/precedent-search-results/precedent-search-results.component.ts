import { Component,Input } from '@angular/core';
import { Provision } from 'src/app-common/models/provision';
import { HttpService } from 'src/app-common/services';
import { ServiceConstants } from 'src/app-common/constants/service.constant';

@Component({
  selector: 'app-precedent-search-results-component',
  templateUrl: './precedent-search-results.component.html'
})
export class PrecedentSearchResultsComponent  {

  private _provisions:Provision[];
    @Input()
    get provisions(): Provision[] {
      return this._provisions;
    }
    set provisions(val: Provision[]) {
        this._provisions = val;
        this.resetProvisionTypeFilters();
    }

  filteredProvisions: Provision[];
  selectedTypes: string[];
  provisionTypes: any[];
  searchOption = 'precedent';
  availableProvisionTypes: string[] = [];

  constructor(private http: HttpService) {
    this.provisions = [];
    this.filteredProvisions = [];
    this.selectedTypes = [];
    this.provisionTypes = [];
  }

    resetProvisionTypeFilters() {
      this.selectedTypes = [];
        this.provisionTypes = [];
        if (this.provisions && this.provisions.length > 0) {
          // group by type
          const groups = this.provisions.reduce((previousResult, item) => {
              if (item.provisionType == null) {
                item.provisionType = '';
              };
              if (!previousResult.hasOwnProperty(item.provisionType)) {
                previousResult[item.provisionType] = [];
              }
              previousResult[item.provisionType].push(item);
              return previousResult;
            },
            {});

          for (let prop in groups) {
            if (groups.hasOwnProperty(prop)) {
              this.provisionTypes.push({
                key: prop,
                count: groups[prop].length,
                isSelected: false
              });
            }
          }
          
        }
        this.onSelectedTypesChange();
    }

  provisionTypeSearch(event) {
    this.http.get(ServiceConstants.ProvisionApiUrl + '/SearchProvisionTypes/' + event.query).subscribe((results) => {
      this.availableProvisionTypes = results;
    });
  }

  provisionTypeOnBlur(provision) {
    if (!provision.isChanged) {
      provision.onFocus = false;
    }
  }

  provisionTypeOnKeyUp(event, provision) {
    provision.isChanged = true;
    if (event.keyCode === 13) {
      this.updateProvisionType(provision);
    }
  }

  provisionTypeOnFocus(provision) {
    if (!provision.onFocus) {
      provision.currentProvisionType = provision.provisionType;
      provision.onFocus = true;
    }
  }

  updateProvisionType(provision) {
    provision.onFocus = false;
    if (provision.isChanged) {
      provision.isChanged = false;
      this.http.put(ServiceConstants.ProvisionApiUrl, provision).subscribe(() => {
        this.resetProvisionTypeFilters();
      });
    }
  }

  cancelUpdateProvisionType(provision) {
    provision.onFocus = false;
    provision.provisionType = provision.currentProvisionType;
    provision.isChanged = false;
  }

  onSelectedTypesChange() {
    if (this.selectedTypes.length) {
      this.filteredProvisions = this.provisions.filter(item => {
        return this.selectedTypes.includes(item.provisionType);
      });
    } else {
      this.filteredProvisions = this.provisions;
    }
  }
}
