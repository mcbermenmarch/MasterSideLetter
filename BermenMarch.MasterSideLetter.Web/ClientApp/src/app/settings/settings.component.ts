import { Component, OnInit  } from '@angular/core';
import { HttpService } from '../../app-common/services';
import { ServiceConstants } from '../../app-common/constants/service.constant';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings: any ={};
  originalSettings: any;
  editingSettings: boolean = false;

  constructor(private http: HttpService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.loadPage();
  }


  loadPage() {
    this.editingSettings = false;
    this.getSettings();

  }

  getSettings() {
    this.http.get(ServiceConstants.SettingsApiUrl + '/').subscribe(result => {
      this.settings = result;
      this.originalSettings = JSON.stringify(result);
    });
  }


  settingsOnKeyUp(event) {
    if (event.keyCode !== 9 && event.keyCode !== 16 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40) {
      this.editingSettings = true;
    }
    if (event.keyCode === 13) {
      //save
      this.saveSettings();
    }
    if (event.keyCode === 27) {
      //cancel
      this.cancelEditSettings();
    }
  }

  saveSettings() {
    this.http.put(ServiceConstants.SettingsApiUrl, this.settings, true).subscribe(() => {
      this.loadPage();
      setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Settings saved.'
          });
        },
        500);
    });
  }

  cancelEditSettings() {
    this.settings = JSON.parse(this.originalSettings);
    this.editingSettings = false;
  }
}

