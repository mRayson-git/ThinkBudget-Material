import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CSVParsingProfile } from 'src/app/models/csvparsing-profile';
import { Transaction } from 'src/app/models/transaction';
import { CsvparserService } from 'src/app/services/csvparser.service';
import { Timestamp } from "@angular/fire/firestore";
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-import-menu',
  templateUrl: './import-menu.component.html',
  styleUrls: ['./import-menu.component.scss']
})
export class ImportMenuComponent implements OnInit {

  parsers?: CSVParsingProfile[];

  importForm: FormGroup = new FormGroup({
    parser: new FormControl('')
  });

  file?: File;

  constructor(public parserService: CsvparserService,
    public transactionService: TransactionService) { }

  ngOnInit(): void {
    this.parserService.getParsers().subscribe(parsers => this.parsers = parsers);
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.importFileAsText()
    // reset form
    this.importForm.reset({parser: ''});
  }

  importFileAsText(): void {
    let fileReader = new FileReader();
    let parser: CSVParsingProfile = this.parsers?.find(parser => parser.profileName == this.importForm.get('parser')!.value)!;
    fileReader.onload = (e) => this.parseTransactions(<string>fileReader.result, parser);
    fileReader.readAsText(this.file!);
  }

  async parseTransactions(data: string, parser: CSVParsingProfile): Promise<void> {
    let transactions: Transaction[] = [];
    try {
      data.split('\n').forEach((row, index) => {
        if (!parser.hasHeader || parser.hasHeader && index !=0) {
          const temp = row.split(',');
          // check for empty row
          if (temp[0] != '') {
            const transaction: Transaction = {
              bankAccountName: parser.profileName,
              transAmount: Number(this.cleanString(temp[parser.amountCol-1])) || 0,
              transDate: Timestamp.fromDate(new Date(this.cleanString(temp[parser.dateCol-1]))),
              transPayee: this.cleanString(temp[parser.payeeCol-1]) || '',
              transType: this.cleanString(temp[parser.typeCol-1]) || ''
            }
            transactions.push(transaction);
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
    this.transactionService.batchSave(transactions);
  }

  cleanString(string: string): string {
    string = string.split('$').join('');
    string = string.split('"').join('');
    return string;
  }

}
