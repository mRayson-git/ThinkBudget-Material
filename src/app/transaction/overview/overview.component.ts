import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatRow, MatTableDataSource } from '@angular/material/table';
import { Transaction } from 'src/app/models/transaction';
import { TransactionService } from 'src/app/services/transaction.service';
import { TransDialogComponent } from '../trans-dialog/trans-dialog.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  allTransForm: FormGroup = new FormGroup({
    periodStart: new FormControl(''),
    periodEnd: new FormControl('')
  });

  periods: Date[] = [];

  transactions?: Transaction[];
  displayedColumns: string[] = ['account-name', 'trans-payee', 'trans-type', 'trans-amount-in', 'trans-amount-out','trans-date', 'trans-category', 'trans-note'];

  monthlyDataSource?: MatTableDataSource<Transaction>;
  allDataSource?: MatTableDataSource<Transaction>;

  currDate: Date = new Date();
  searching: boolean = false;

  constructor(public transactionService: TransactionService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.transactionService.getMonthlyTransactions(this.currDate).subscribe(transactions => {
      // console.log(transactions);
      this.monthlyDataSource = new MatTableDataSource(transactions);
      this.monthlyDataSource.filterPredicate = this.customFilterPredicate();
    });
    this.populatePeriodOptions();
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  editElement(transaction: Transaction) {
    const transactionDialogRef = this.dialog.open(TransDialogComponent, {
      minWidth: '400px',
      data: {transaction: transaction},
    });
    transactionDialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }

  addTransaction() {
    const transactionDialogRef = this.dialog.open(TransDialogComponent, {
      minWidth: '400px',
    });
    transactionDialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }

  getTransactions(): void {
    this.searching = true;
    this.transactionService.getTransactionsInTimeframe(this.allTransForm.get('periodStart')!.value, this.allTransForm.get('periodEnd')!.value).subscribe(transactions => {
      this.allDataSource = new MatTableDataSource(transactions);
      this.allDataSource.filterPredicate = this.customFilterPredicate();
      this.searching = false;
    });
  }

  applyFilter(event: Event, source: MatTableDataSource<Transaction>) {
    const filterValue = (event.target as HTMLInputElement).value;
    // console.log("Applying filter: " + filterValue);
    source.filter = filterValue.trim().toLowerCase();
  }

  customFilterPredicate() {
    const filterPredicate = (data: Transaction, filter: string): boolean => {
      let accountNameFilter: boolean = data.bankAccountName.toLowerCase().trim().indexOf(filter) !== -1;
      let payeeFilter: boolean = data.transPayee.toLowerCase().trim().indexOf(filter) !== -1;
      let amountFilter: boolean = data.transAmount.toString().toLowerCase().trim().indexOf(filter) !== -1;
      let catParentFilter: boolean = data.transCategory?.parent.toString().toLowerCase().trim().indexOf(filter) !== -1;
      let catChildFilter: boolean = data.transCategory?.name.toString().toLowerCase().trim().indexOf(filter) !== -1;
      let descFilter: boolean = data.transType.toLowerCase().trim().indexOf(filter) !== -1;
      let noteFilter: boolean = data.transNote?.toLowerCase().trim().indexOf(filter) !== -1;

      return  accountNameFilter || payeeFilter || amountFilter || catParentFilter || catChildFilter || descFilter || noteFilter;
    }
    return filterPredicate;
  }

  populatePeriodOptions(): void {
    const currDate = new Date()
    // goes through the years
    for (let i = currDate.getFullYear(); i > 1999 ; i--) {
      // goes through the months
      for (let j = 11; j >= 0; j--) {
        if (i == currDate.getFullYear() && j > currDate.getMonth()) j = currDate.getMonth();
        this.periods.push(new Date(i, j));
      }
    }
  }
}
