import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Budget } from 'src/app/models/budget';
import { Category } from 'src/app/models/category';
import { BudgetService } from 'src/app/services/budget.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {


  currDate: Date = new Date();
  budget?: Budget | null;
  pastBudget?: Budget | null;

  budgetIncomeForm: FormGroup = new FormGroup({
    income: new FormControl(''),
  });

  budgetAlterationForm: FormGroup = new FormGroup({
    income: new FormControl(''),
    category: new FormControl(''),
    amount: new FormControl(''),
    colour: new FormControl(''),
    newCatParent: new FormControl(''),
    newCatChild: new FormControl(''),
  });

  // Chart options information
  chartOption?: EChartsOption;

  chartData?: { value: number, name: string }[];

  constructor(public budgetService: BudgetService) { }

  ngOnInit(): void {
    // get current budget
    this.budgetService.getMonthlyBudget(this.currDate).subscribe(budget => {
      this.budget = budget[0] || null;
      if (this.budget != null) {
        this.budgetAlterationForm.get('income')?.setValue(this.budget.income);
      }
      // get last months budget to account for overflow
      this.budgetService.getMonthlyBudget(this.getLastMonth()).subscribe(budget => {
        this.pastBudget = budget[0] || null;
        this.buildChart();
      });
    });
    
  }

  createBudget(): void {
    let budget: Budget = {
      income: Number(this.budgetIncomeForm.get('income')!.value),
      date: Timestamp.fromDate(this.currDate),
      categories: []
    }
    this.budgetService.createBudget(budget)
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  updateIncome(): void {
    this.budget!.income = Number(this.budgetAlterationForm.get('income')?.value);
    this.budgetService.updateBudget(this.budget!)
    .then(result => console.log(result))
    .catch(error => console.log(error));
  }

  updateBudget(): void {
    // If not adding a new cat
    let category: Category;
    if (!this.isAddingNewCat()) {
      category = this.budgetAlterationForm.get('category')?.value;
    }
    // If we are adding a new cat
    else {
      category = {
        parent: this.budgetAlterationForm.get('newCatParent')?.value,
        name: this.budgetAlterationForm.get('newCatChild')?.value
      }
    }
    category.amount = this.budgetAlterationForm.get('amount')?.value;
    category.colour = this.budgetAlterationForm.get('colour')?.value;
    
    // Remove if it already exists
    this.budget!.categories = this.budget?.categories?.filter(budgetCategory => !(budgetCategory.parent == category.parent && budgetCategory.name == category.name)) || [];
    // Add in the category
    this.budget!.categories.push(category);
    // Update the budget
    this.budgetService.updateBudget(this.budget!);
    // Reset the form
    this.budgetAlterationForm.reset();
  }

  importPastBudget(): void {
    let newBudget: Budget = {
      income: this.pastBudget?.income!,
      date: Timestamp.fromDate(new Date()),
      categories: this.pastBudget?.categories!,
    }
    
    this.budgetService.createBudget(newBudget)
      .then(result => console.log(result))
      .catch(err => console.log(err));;
  }

  removeCategory(category: Category): void {
    this.budget!.categories = this.budget?.categories?.filter(budgetCategory => !(budgetCategory.parent == category.parent && budgetCategory.name == category.name)) || [];
    this.budgetService.updateBudget(this.budget!);
    // Reset the form
    this.budgetAlterationForm.reset();
  }

  hasCategory(category: Category): boolean {
    if (category != null && this.budget?.categories.find(budgetCategory => budgetCategory.parent == category.parent && budgetCategory.name == category.name)) return true;
    return false;
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

  isAddingNewCat(): boolean {
    return this.budgetAlterationForm.get('category')?.value == "newCat";
  }

  buildChart(): void {
    let chartData: { value: number, name: string}[] = [];
    let chartColours: string[] = [];
    this.budget?.categories.forEach(category => {
      chartData?.push({
        name: category.name,
        value: category.amount!
      });
    });
    chartData.push({
      value: this.budgetService.getRemaining(this.budget!, this.pastBudget?.overflow),
      name: 'Remaining'
    });
    this.chartOption = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Budget',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: chartData
        }
      ],
      color: [
        "#e6ffee",
        "#ccffdd",
        "#b3ffcc",
        "#99ffbb",
        "#80ffaa",
        "#66ff99",
        "#4dff88",
        "#33ff77",
        "#1aff66",
        "#00ff55",
        "#00e64d",
        "#00cc44",
        "#00b33c",
        "#009933",
        "#00802b",
        "#006622",
        "#004d1a",
        "#ccffcc",
        "#b3ffb3",
        "#99ff99",
        "#80ff80",
        "#66ff66",
        "#4dff4d",
        "#33ff33",
        "#1aff1a",
        "#00ff00",
        "#00e600",
        "#00cc00",
        "#00b300",
        "#009900",
        "#008000",
      ]
    };
  }
  
  

}
