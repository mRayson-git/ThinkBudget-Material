import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
      console.log(transactions);
      this.monthlyDataSource = new MatTableDataSource(transactions);
    });
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

  getAllTransactions(): void {
    this.searching = true;
    this.transactionService.getTransactions().subscribe(transactions => {
      this.allDataSource = new MatTableDataSource(transactions);
      this.searching = false;
    });
  }
}
