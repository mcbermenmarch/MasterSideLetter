import { Component, ViewChild } from '@angular/core';
import { InvestorListComponent } from "../investor-list/investor-list.component";

@Component({
  selector: 'app-investors-component',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss']
})
export class InvestorsComponent {


  @ViewChild("favoriteInvestors", { static: false })
  favoriteInvestors: InvestorListComponent;
    @ViewChild("allInvestors", { static: false })
    allInvestors: InvestorListComponent;

  onClick(event) {
    this.favoriteInvestors.trySaveEdits();
      this.allInvestors.trySaveEdits();
  }

  favoriteInvestorsOnClick(event) {
    event.stopPropagation();
      this.allInvestors.trySaveEdits();
  }

  allInvestorsOnClick(event) {
    event.stopPropagation();
      this.favoriteInvestors.trySaveEdits();
  }
}
