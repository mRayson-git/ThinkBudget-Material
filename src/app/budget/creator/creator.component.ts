import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Budget } from 'src/app/models/budget';
import { Category } from 'src/app/models/category';
import { BudgetService } from 'src/app/services/budget.service';

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
  });

  constructor(public budgetService: BudgetService) { }

  ngOnInit(): void {
    // get current budget
    this.budgetService.getMonthlyBudget(this.currDate).subscribe(budget => {
      this.budget = budget[0] || null;
      if (this.budget != null) this.budgetAlterationForm.get('income')?.setValue(this.budget.income);
    });
    // get last months budget to account for overflow
    this.budgetService.getMonthlyBudget(this.getLastMonth()).subscribe(budget => {
      this.pastBudget = budget[0] || null;
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

  updateBudget(): void {
    // Make the category
    let category: Category = this.budgetAlterationForm.get('category')?.value;
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
      lastMonth = new Date(this.currDate.getFullYear() - 1, 12);
    }

    return lastMonth;
  }
  

}
