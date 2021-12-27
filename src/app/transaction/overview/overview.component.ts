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
  displayedColumns: string[] = ['account_name', 'trans_payee', 'trans_type', 'trans_amount', 'trans_date', 'trans_note'];

  constructor(public transactionService: TransactionService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe(transactions => this.transactions = transactions);
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
}
