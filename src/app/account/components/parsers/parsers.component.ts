import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CSVParsingProfile } from 'src/app/models/csvparsing-profile';
import { LayoutDialogComponent } from './layout-dialog/layout-dialog.component';

@Component({
  selector: 'app-parsers',
  templateUrl: './parsers.component.html',
  styleUrls: ['./parsers.component.scss']
})
export class ParsersComponent implements OnInit {

  parsers?: CSVParsingProfile[];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addLayout(): void {
    const layoutDialogRef = this.dialog.open(LayoutDialogComponent, {
      minWidth: '400px',
    });

    layoutDialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }

}
