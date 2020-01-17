import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  HomeComponent,
  FundsComponent,
  InvestorsComponent,
  FundProfileComponent,
  InvestorProfileComponent,
  ProvisionComponent,
  PrecedentSearchComponent,
  StandardSearchComponent,
  SettingsComponent
} from '.';



export const RootRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: '',
    children: [
      {
        path: 'investors',
        component: InvestorsComponent
      },
      {
        path: 'investors/:id',
        component: InvestorProfileComponent
      }
    ]
  },
  {
    path: 'provision',
    component: ProvisionComponent
  },
  {
    path: '',
    children: [
      {
        path: 'funds',
        component: FundsComponent
      },
      {
        path: 'funds/:id',
        component: FundProfileComponent
      }
    ]
  },
  {
    path: 'precedent-search',
    component: PrecedentSearchComponent
  },
  {
    path: 'standard-search',
    component: StandardSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(RootRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
