import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
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
  pastBudget?: Budget | null;
  transactions?: Transaction[] | null;

  chartOption?: EChartsOption;

  constructor(public budgetService: BudgetService,
    public transactionService: TransactionService) { }

  ngOnInit(): void {
    this.budgetService.getMonthlyBudget(this.currDate).pipe(take(1)).subscribe(budget => {
      this.budget = budget[0] || null;
      if (this.budget != null) {
        this.transactionService.getMonthlyTransactions(this.currDate)
          .pipe(take(1)).subscribe(transactions => {
            this.transactions = transactions;
            this.budgetService.calculateOverflow(this.budget!, this.transactions);
            this.buildChart();
        });
      }
    });
    this.budgetService.getMonthlyBudget(this.getLastMonth()).subscribe(budget => {
      this.pastBudget = budget[0] || null;
    });
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
  // Update past month overflow
  updatePastMonthOverflow(): void {
    // 1: get past month budget
    let pastTransactions: Transaction[];
    this.transactionService.getMonthlyTransactions(this.getLastMonth()).subscribe(transactions => {
      pastTransactions = transactions;
      this.budgetService.calculateOverflow(this.pastBudget!, pastTransactions);
    });
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

  buildChart(): void {
    let chartDataset = [
      ['Category', 'Remaining']
    ];
    let chartCategories: string[] = [];
    let chartData: number[] = [];
    this.budgetService.getParentCategories(this.budget!).forEach(parent => {
      this.budgetService.getCategoriesForParent(parent, this.budget!).forEach(category => {
        chartDataset.push([category.name, (category.amount! - Math.abs(this.transactionService.getTotalSpentForCategory(this.transactions!, category))).toString()])
      });
    });
    this.chartOption = {
      tooltip: {},
      dataset: {
        source: chartDataset
      },
      xAxis: { 
        type: 'category',
        axisLabel: {
          align: 'center'
        },
        show: false
      },
      yAxis: { },
      series: [{
        type: 'bar',
        label: {
          show: true,
          position: 'bottom',
          formatter: '{b}',
          color: 'white'
        },
      }],
      color: [
        "#66ff99",
      ]
    }
  }
}
