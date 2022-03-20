import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Timestamp } from "@angular/fire/firestore";
import { CSVParsingProfile } from 'src/app/core/models/csvparsing-profile';
import { CsvparserService } from 'src/app/core/services/csvparser.service';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { Transaction } from 'src/app/core/models/transaction';

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
          console.log(temp);
          if (temp[0] != '') {
            const transaction: Transaction = {
              bankAccountName: parser.profileName,
              transAmount: Number(this.cleanString(temp[parser.amountCol-1])) || 0,
              transDate: Timestamp.fromDate(new Date(this.cleanString(temp[parser.dateCol-1]))),
              transPayee: this.cleanString(temp[parser.payeeCol-1], true) || '',
              transType: this.cleanString(temp[parser.typeCol-1], true) || ''
            }
            console.log(`pushing transaction ${transaction}`);
            transactions.push(transaction);
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
    console.log(transactions);
    this.transactionService.batchSave(transactions);
  }

  cleanString(string: string, cleanAccount?: boolean): string {
    if (string) {
      string = string.split('$').join('');
      string = string.split('"').join('');
      if (cleanAccount) string = this.cleanAccountNumber(string);
      return string;
    }
    return string;
  }

  cleanAccountNumber(string: string): string {
    // split string into words / numbers
    let strArray = string.split(' ');
    strArray.forEach((element, index) => {
      // if 9 digits
      // console.log(element.length);
      if (element.length == 9) {
        try {
          let number = Number.parseInt(element);
          let end = element.slice(5, 9);
          strArray[index] = "XXXXX" + end;
        } catch (err) { }
      }
    })
    return strArray.join(" ");
  }

}
