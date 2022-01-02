import { Component, Inject, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Budget } from 'src/app/models/budget';
import { Category } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
import { BudgetService } from 'src/app/services/budget.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-trans-dialog',
  templateUrl: './trans-dialog.component.html',
  styleUrls: ['./trans-dialog.component.scss']
})
export class TransDialogComponent implements OnInit {

  transForm: FormGroup = new FormGroup({
    bankAccountName: new FormControl(''),
    transDate: new FormControl(''),
    transAmount: new FormControl(''),
    transPayee: new FormControl(''),
    transType: new FormControl(''),
    transNote: new FormControl(''),
    transCategory: new FormControl(''),
  });

  budget?: Budget | null;

  ignored: Category = { parent: "Misc", name: "Ignored" };

  constructor(public transDialogRef: MatDialogRef<TransDialogComponent>,
    public transactionService: TransactionService,
    public budgetService: BudgetService,
    @Inject(MAT_DIALOG_DATA) public data: {transaction: Transaction}) { }

  ngOnInit(): void {
    // TODO: Get it to pull the budget for the month of the current transaction
    this.budgetService.getMonthlyBudget(new Date()).pipe(take(1)).subscribe(budget => this.budget = budget[0] || null);
    // if data is present we are editing
    if (this.data) {
      console.log(this.data.transaction);
      this.transForm.get('bankAccountName')?.setValue(this.data.transaction.bankAccountName);
      this.transForm.get('transDate')?.setValue(this.data.transaction.transDate.toDate());
      this.transForm.get('transAmount')?.setValue(this.data.transaction.transAmount);
      this.transForm.get('transPayee')?.setValue(this.data.transaction.transPayee);
      this.transForm.get('transType')?.setValue(this.data.transaction.transType);
      this.transForm.get('transCategory')?.setValue(this.data.transaction.transCategory) || '';
      this.transForm.get('transNote')?.setValue(this.data.transaction.transNote) || '';
    }
  }

  addTrans(): void {
    let transaction: Transaction = this.transForm.value;
    this.transactionService.createTransaction(transaction)
    .then(result => {
      console.log(result);
      this.transDialogRef.close();
    })
    .catch(err => {
      console.log(err);
      this.transDialogRef.close();
    });
  }

  deleteTrans(): void {
    this.transactionService.deleteTransaction(this.data.transaction)
    .then(result => {
      console.log(result);
      this.transDialogRef.close();
    })
    .catch(err => {
      console.log(err);
      this.transDialogRef.close();
    });
  }

  updateTrans(): void {
    let transaction = this.buildTransaction();
    this.transactionService.updateTransaction(transaction)
    .then(result => {
      console.log(result);
      this.transDialogRef.close();
    })
    .catch(err => {
      console.log(err);
      this.transDialogRef.close();
    });
  }

  buildTransaction(): Transaction {
    const transaction: Transaction = {
      id: this.data.transaction.id,
      bankAccountName: this.transForm.get('bankAccountName')?.value,
      transDate: Timestamp.fromDate(this.transForm.get('transDate')?.value),
      transAmount: this.transForm.get('transAmount')?.value,
      transPayee: this.transForm.get('transPayee')?.value,
      transType: this.transForm.get('transType')?.value,
      transCategory: this.transForm.get('transCategory')?.value || null,
      transNote: this.transForm.get('transNote')?.value || '',
    }
    console.log(transaction);
    return transaction;
  }

  close() {
    this.transDialogRef.close();
  }

}
