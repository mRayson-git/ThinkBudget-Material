import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { firstValueFrom } from 'rxjs';
import { Budget } from 'src/app/core/models/budget';
import { Category } from 'src/app/core/models/category';
import { BudgetService } from 'src/app/core/services/budget.service';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit {


  currDate: Date = new Date();
  budget?: Budget | null;
  pastBudget?: Budget | null;
  categories: Category[] = [];

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

  async ngOnInit(): Promise<void> {
    // get current budget
    this.budget = (await firstValueFrom(this.budgetService.getMonthlyBudget(this.currDate))).pop();
    // set income field value get categories
    if (this.budget != null) {
      this.budgetAlterationForm.get('income')?.setValue(this.budget.income);
      this.categories = this.budgetService.getAllCategories(this.budget);
    } else {
      this.categories = this.budgetService.getAllCategories(this.budget);
    }
    // get last budget for overflow
    this.pastBudget = (await firstValueFrom(this.budgetService.getMonthlyBudget(this.getLastMonth()))).pop();
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
}
