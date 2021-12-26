import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CSVParsingProfile } from 'src/app/models/csvparsing-profile';
import { CsvparserService } from 'src/app/services/csvparser.service';

@Component({
  selector: 'app-layout-dialog',
  templateUrl: './layout-dialog.component.html',
  styleUrls: ['./layout-dialog.component.scss']
})
export class LayoutDialogComponent implements OnInit {

  layoutForm: FormGroup = new FormGroup({
    profileName: new FormControl(''),
    hasHeader: new FormControl(true),
    amountCol: new FormControl(''),
    dateCol: new FormControl(''),
    payeeCol: new FormControl(''),
    typeCol: new FormControl(''),
  });

  constructor(public layoutDialogRef: MatDialogRef<LayoutDialogComponent>,
    public auth: Auth,
    public parserService: CsvparserService) {
      //login user here
    }

  ngOnInit(): void {
  }

  saveLayout(): void {
    let layout: CSVParsingProfile = this.layoutForm.value;
    this.parserService.addParser(layout)
    .then(result => {
      console.log(result);
      this.close;
    })
    .catch(err => {
      console.log(err);
      this.close();
    });
  }

  close(): void {
    this.layoutDialogRef.close();
  }

}
