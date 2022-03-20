import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Budget } from 'src/app/core/models/budget';
import { Transaction } from 'src/app/core/models/transaction';
import { BudgetService } from 'src/app/core/services/budget.service';
import { TransactionService } from 'src/app/core/services/transaction.service';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss']
})
export class HistoricalComponent implements OnInit {

  currDate = new Date();
  budgetShown?: Budget;
  transactions?: Transaction[];

  constructor(public budgetService: BudgetService, public transactionService: TransactionService) { }

  ngOnInit(): void {
    this.budgetService.getMonthlyBudget(this.getLastMonth()).subscribe(budget => {
      this.budgetShown = budget[0] || null;
      if (this.budgetShown != null) {
        this.transactionService.getMonthlyTransactions(this.getLastMonth()).pipe(take(1)).subscribe(transactions => {
          this.transactions = transactions;
        });
      }
    })
  }

  getLastMonth(): Date {
    let lastMonth: Date;
    // general situation
    lastMonth = new Date(this.currDate.getFullYear(), this.currDate.getMonth() - 1);
    // on year change
    if (this.currDate.getMonth() == 0) {
      lastMonth = new Date(this.currDate.getFullYear() - 1, 11);
    }
    return lastMonth;
  }

}
