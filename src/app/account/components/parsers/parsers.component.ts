import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CSVParsingProfile } from 'src/app/models/csvparsing-profile';
import { CsvparserService } from 'src/app/services/csvparser.service';
import { LayoutDialogComponent } from './layout-dialog/layout-dialog.component';

@Component({
  selector: 'app-parsers',
  templateUrl: './parsers.component.html',
  styleUrls: ['./parsers.component.scss']
})
export class ParsersComponent implements OnInit {

  parsers?: CSVParsingProfile[];

  constructor(public dialog: MatDialog,
    public parserService: CsvparserService) { }

  ngOnInit(): void {
    this.parserService.getParsers().subscribe(parsers => this.parsers = parsers);
  }

  addLayout(): void {
    const layoutDialogRef = this.dialog.open(LayoutDialogComponent, {
      minWidth: '400px',
    });
    layoutDialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }

  updateParser(newParser: CSVParsingProfile) {
    const layoutDialogRef = this.dialog.open(LayoutDialogComponent, {
      minWidth: '400px',
      data: { parser: newParser },
    });
    layoutDialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }

  deleteParser(parser: CSVParsingProfile) {
    this.parserService.deleteParser(parser);
  }

}
