import { Component, ViewChild } from '@angular/core';
import { FundListComponent } from "../fund-list/fund-list.component";
import { InvestorListComponent } from "../investor-list/investor-list.component";

@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild("favoriteFunds", { static: false })
  favoriteFunds: FundListComponent;
  @ViewChild("recentFunds", { static: false })
  recentFunds: FundListComponent;
  @ViewChild("favoriteInvestors", { static: false })
  favoriteInvestors: InvestorListComponent;
  @ViewChild("recentInvestors", { static: false })
  recentInvestors: InvestorListComponent;

  onClick(event) {
    this.favoriteFunds.trySaveEdits();
    this.recentFunds.trySaveEdits();
    this.favoriteInvestors.trySaveEdits();
    this.recentInvestors.trySaveEdits();
  }

  favoriteFundsOnClick(event) {
    event.stopPropagation();
    this.recentFunds.trySaveEdits();
    this.favoriteInvestors.trySaveEdits();
    this.recentInvestors.trySaveEdits();
  }

  recentFundsOnClick(event) {
    event.stopPropagation();
    this.favoriteFunds.trySaveEdits();
    this.favoriteInvestors.trySaveEdits();
    this.recentInvestors.trySaveEdits();
  }


  favoriteInvestorsOnClick(event) {
    event.stopPropagation();
    this.recentInvestors.trySaveEdits();
    this.favoriteFunds.trySaveEdits();
    this.recentFunds.trySaveEdits();
  }

  recentInvestorsOnClick(event) {
    event.stopPropagation();
    this.favoriteInvestors.trySaveEdits();
    this.favoriteFunds.trySaveEdits();
    this.recentFunds.trySaveEdits();
  }
}
