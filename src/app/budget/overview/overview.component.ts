import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Budget } from 'src/app/models/budget';
import { Category } from 'src/app/models/category';
import { Transaction } from 'src/app/models/transaction';
import { BudgetService } from 'src/app/services/budget.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  currDate: Date = new Date();
  budget?: Budget | null;
  transactions?: Transaction[] | null;

  constructor(public budgetService: BudgetService,
    public transactionService: TransactionService) { }

  ngOnInit(): void {
    this.budgetService.getMonthlyBudget(this.currDate).pipe(take(1)).subscribe(budget => {
      this.budget = budget[0] || null;
      if (budget != null) {
        this.transactionService.getMonthlyTransactions(this.currDate)
          .pipe(take(1)).subscribe(transactions => {
            this.transactions = transactions;
            this.calculateOverflow();
        });
      };
    });
    
  }

  // get total saved
  getTotalSaved(): number {
    let total = 0;
    this.transactions!.forEach(transaction => {
      // minus since the money is leaving for a savings account
      if (transaction.transCategory?.parent == "Saving") total = total - transaction.transAmount;
    });
    return total;
  }

  // get total spent
  getTotalSpent(): number {
    let total = 0;
    this.transactions?.forEach(transaction => {
      if (transaction.transCategory?.parent != "Income") total = total - transaction.transAmount;
    });
    return total;
  }

  // get total outgoing
  getTotalOutgoing(): number {
    return this.getTotalSpent() - this.getTotalSaved();
  }

  // get total income
  getTotalIncome(): number {
    let total = 0;
    this.transactions?.forEach(transaction => {
      if (transaction.transCategory?.parent == "Income") total = total + transaction.transAmount;
    });
    return total;
  }

  // get totals per category
  getTotalForCategory(category: Category): number {
    let total = 0;
    this.transactions!.forEach(transaction => {
      if (transaction.transCategory?.parent == category.parent 
        && transaction.transCategory.name == category.name) {
          total = total + Math.abs(transaction.transAmount);
      }
    });
    return total;
  }

  calculateOverflow(): void {
    this.budget!.overflow = this.getTotalIncome() - this.getTotalSpent();
    console.log(`Overflow calculated at: ${this.getTotalIncome() - this.getTotalSpent()}`);
    this.budgetService.updateBudget(this.budget!);
  }
}
