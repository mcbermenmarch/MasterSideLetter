import { Component,ViewChild } from '@angular/core';
import { FundListComponent } from "../fund-list/fund-list.component";

@Component({
  selector: 'app-funds-component',
  templateUrl: './funds.component.html',
  styleUrls: ['./funds.component.scss']
})
export class FundsComponent {

  @ViewChild("favoriteFunds", { static: false })
  favoriteFunds: FundListComponent;
  @ViewChild("allFunds", { static: false })
  allFunds: FundListComponent;

    onClick(event) {
      this.favoriteFunds.trySaveEdits();
    this.allFunds.trySaveEdits();
  }

    favoriteFundsOnClick(event) {
      event.stopPropagation();
    this.allFunds.trySaveEdits();
  }

    allFundsOnClick(event) {
      event.stopPropagation();
    this.favoriteFunds.trySaveEdits();
  }
}
