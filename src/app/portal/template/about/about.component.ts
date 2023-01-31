import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { systemEnvironment } from 'src/environments/system-environment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {

  constructor(private dialog: DynamicDialogRef) { }

  systemName: string;
  versionNumber: string;
  versionDate: string;
  environmentName: string;

  ngOnInit(): void {
    this.systemName = systemEnvironment.systemName;
    this.versionDate = systemEnvironment.versionDate;
    this.versionNumber = systemEnvironment.versionNumber;
    this.environmentName = environment.environmentName;
  }

  closeModal() {
    this.dialog.close();
  }

}
