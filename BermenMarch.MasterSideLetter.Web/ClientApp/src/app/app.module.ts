// vendor
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule , CurrencyPipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Prime NG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenubarModule } from 'primeng/menubar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { SidebarModule } from 'primeng/sidebar';
import { DeferModule } from 'primeng/defer';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { SelectButtonModule } from 'primeng/selectbutton';

//components

import { COMPONENTS } from '.';
import { AppComponent } from './app.component';

// modules
import { AppRoutingModule } from './app-routing.module';

//services
import { SERVICES } from '../app-common/services';


@
  NgModule({
    declarations: [
      AppComponent,
      COMPONENTS
    ],
    imports: [
      BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      AppRoutingModule,
      AutoCompleteModule,
      CommonModule,
      TableModule,
      ButtonModule,
      DialogModule,
      TabMenuModule,
      FileUploadModule,
      ReactiveFormsModule,
      InputTextModule,
      InputTextareaModule,
      MenubarModule,
      RadioButtonModule,
      CheckboxModule,
      ProgressBarModule,
      SidebarModule,
      DeferModule,
      DropdownModule,
      SliderModule,
      ToastModule,
      PanelModule,
      SelectButtonModule
    ],
    providers: [
      SERVICES,
      CurrencyPipe
    ],
    bootstrap: [AppComponent]
  })
export class AppModule { }
