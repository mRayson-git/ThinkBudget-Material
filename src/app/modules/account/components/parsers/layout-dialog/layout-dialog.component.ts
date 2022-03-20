import { Component, Inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CSVParsingProfile } from 'src/app/core/models/csvparsing-profile';
import { CsvparserService } from 'src/app/core/services/csvparser.service';

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
    public parserService: CsvparserService,
    @Inject(MAT_DIALOG_DATA) public data: {parser: CSVParsingProfile}) { }

  ngOnInit(): void {
    if (this.data) {
      console.log(this.data);
      this.layoutForm.get('profileName')?.setValue(this.data.parser.profileName);
      this.layoutForm.get('hasHeader')?.setValue(this.data.parser.hasHeader);
      this.layoutForm.get('amountCol')?.setValue(this.data.parser.amountCol);
      this.layoutForm.get('dateCol')?.setValue(this.data.parser.dateCol);
      this.layoutForm.get('payeeCol')?.setValue(this.data.parser.payeeCol);
      this.layoutForm.get('typeCol')?.setValue(this.data.parser.typeCol);
    }
  }

  saveLayout(): void {
    let layout: CSVParsingProfile = this.layoutForm.value;
    this.parserService.addParser(layout)
    .then(result => {
      this.close();
    })
    .catch(err => {
      console.log(err);
      this.close();
    });
  }

  updateLayout(): void {
    let layout: CSVParsingProfile = this.layoutForm.value;
    layout.id = this.data.parser.id;
    this.parserService.updateParser(layout)
    .then(result => {
      console.log(layout);
      this.close();
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
