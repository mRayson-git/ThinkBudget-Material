import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { firstValueFrom, take } from 'rxjs';
import { Budget } from 'src/app/core/models/budget';
import { Transaction } from 'src/app/core/models/transaction';
import { BudgetService } from 'src/app/core/services/budget.service';
import { TransactionService } from 'src/app/core/services/transaction.service';


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

  /**
   * Triggered on component instantiation
   */
  async ngOnInit(): Promise<void> {
    // get current month
    this.budget = (await firstValueFrom(this.budgetService.getMonthlyBudget(this.currDate))).pop();
    this.transactions = await firstValueFrom(this.transactionService.getMonthlyTransactions(this.currDate));
    // get past month overflow
    this.pastBudget = (await firstValueFrom(this.budgetService.getMonthlyBudget(this.getLastMonth()))).pop();
    if (this.budget && this.pastBudget && this.transactions) {
      this.budgetService.calculateOverflow(this.budget, this.pastBudget, this.transactions);
    }
    // this.getTotalsForCategories();
    this.buildChart();    
  }
  
  /**
   * Get the totals for the budgeted categories
   */
  getTotalsForCategories(): void {
    if (this.budget == null || this.transactions == null) return;
    this.budget.categories.forEach(category => {
      let total = 0;
      this.transactions!.forEach(transaction => {
        if (transaction.transCategory?.parent == category.parent 
          && transaction.transCategory.name == category.name) {
            total = total + Math.abs(transaction.transAmount);
        }
      });
      this.budget!.budgetStats?.categoryStats?.push({ category: category, totalSpent: total });
    });
  }

  /**
   * Gets the overflow for the past with the most recent transactions
   */
  updatePastMonthOverflow(): void {
    // 1: get past month budget
    let pastTransactions: Transaction[];
    this.transactionService.getMonthlyTransactions(this.getLastMonth()).subscribe(transactions => {
      pastTransactions = transactions;
      this.budgetService.calculateOverflow(this.pastBudget!, null, pastTransactions);
    });
  }

  /**
   * 
   * @returns Date - the date of the last month
   */
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

  /**
   * Builds the budget graph that shows remaining budget values
   */
  buildChart(): void {
    let chartDataset = [
      ['Category', 'Remaining']
    ];
    let chartCategories: string[] = [];
    let chartData: number[] = [];
    this.budgetService.getParentCategories(this.budget!).forEach(parent => {
      this.budgetService.getCategoriesForParent(parent, this.budget!).forEach(category => {
        chartDataset.push([category.name, (category.amount! - this.transactionService.getTotalSpentForCategory(this.transactions!, category)).toString()])
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
          interval: 0,
          rotate: 45,
        },
        axisTick: {
          alignWithLabel: true,
        },
        show: true,
      },
      yAxis: { },
      series: [{
        type: 'bar',
      }],
      color: [
        "#3b894a",
      ]
    }
  }
}
