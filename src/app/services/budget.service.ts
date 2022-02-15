import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentReference, Firestore, limit, orderBy, query, setDoc, Timestamp, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Budget } from '../models/budget';
import { Category } from '../models/category';
import { Transaction } from '../models/transaction';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  currUser: User | null;
  budgetCollectionRef!: CollectionReference;

  // default parent categories
  parentCategories: string[] = [
    "Food",
    "Housing",
    "Income",
    "Health",
    "Personal",
    "Saving",
    "Transportation",
    "Utilities",
    "Misc",
  ]
  // default child categories
  childCategories: Category[] = [
    // Food
    { parent: 'Food', name: 'Delivery' },
    { parent: 'Food', name: 'Dining Out' },
    { parent: 'Food', name: 'Groceries' },

    // Housing
    { parent: 'Housing', name: 'Mortgage' },
    { parent: 'Housing', name: 'Maintenance' },
    { parent: 'Housing', name: 'Renovation' },
    { parent: 'Housing', name: 'Rent' },

    // Income
    { parent: 'Income', name: 'Misc' },
    { parent: 'Income', name: 'Payroll' },
    { parent: 'Income', name: 'Benefit' },

    // Health
    { parent: 'Health', name: 'Dental' },
    { parent: 'Health', name: 'Other' },
    { parent: 'Health', name: 'Optometry' },

    // Personal
    { parent: 'Personal', name: 'Entertainment' },
    { parent: 'Personal', name: 'Gifts' },
    { parent: 'Personal', name: 'Health' },
    { parent: 'Personal', name: 'Hobby' },
    { parent: 'Personal', name: 'Recreation' },
    { parent: 'Personal', name: 'Animal Care' },

    // Savings
    { parent: 'Saving', name: 'Emergency Fund' },
    { parent: 'Saving', name: 'Investment' },
    { parent: 'Saving', name: 'Non-Investment' },

    // Transportation
    { parent: 'Transportation', name: 'Car Payments' },
    { parent: 'Transportation', name: 'Gas' },
    { parent: 'Transportation', name: 'Maintenance' },
    { parent: 'Transportation', name: 'Parking' },
    { parent: 'Transportation', name: 'Repairs' },
    { parent: 'Transportation', name: 'Tolls' },
    { parent: 'Transportation', name: 'Transit Pass' },

    // Utilities
    { parent: 'Utilities', name: 'Electricity' },
    { parent: 'Utilities', name: 'Gas' },
    { parent: 'Utilities', name: 'Phone' },
    { parent: 'Utilities', name: 'Water' },

    // Misc
    { parent: 'Misc', name: 'Ignored' },
  ]
  
  constructor(private firestore: Firestore, private  auth: Auth, private transactionService: TransactionService) {
    this.currUser = auth.currentUser;
    this.budgetCollectionRef = collection(firestore, `${this.currUser?.uid}/thinkbudget/budgets`);
  }

  // create
  createBudget(budget: Budget) {
    return addDoc(this.budgetCollectionRef, budget);
  }

  // read
  getAllBudgets(): Observable<Budget[]> {
    return collectionData(this.budgetCollectionRef, {idField: 'id'}) as Observable<Budget[]>;
  }

  getMonthlyBudget(date: Date): Observable<Budget[]> {
    let q = query(this.budgetCollectionRef, 
      where('date', '>=', Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth()))),
      where('date', '<', Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth() + 1))));
    return collectionData(q, {idField: 'id'}) as Observable<Budget[]>
  }

  // update
  updateBudget(budget: Budget): Promise<void> {
    let budgetDocRef = doc(this.firestore, `${this.currUser?.uid}/thinkbudget/budgets/${budget.id}`);
    return setDoc(budgetDocRef, budget);
  }

  // delete
  deleteBudget(budget: Budget): Promise<void> {
    let budgetDocRef = doc(this.firestore, `${this.currUser?.uid}/thinkbudget/budgets/${budget.id}`);
    return deleteDoc(budgetDocRef);
  }

  // Helper methods
  getParentCategories(budget: Budget): string[] {
    let parentList: string[] = [];
    budget.categories.forEach(category => {
      if (parentList.find(parent => parent == category.parent) == undefined) {
        parentList.push(category.parent);
      }
    });
    return parentList.sort();
  }

  getCategoriesForParent(parent: string, budget: Budget): Category[] {
    return budget.categories.filter(budgetCategory => budgetCategory.parent == parent)
    .sort((a,b) => {
      if (a.name > b.name) return 1;
      else if (a.name < b.name) return -1;
      else return 0;}) || [];
  }

  getIncomeCategories(): Category[] {
    return this.childCategories.filter(category => category.parent == "Income")
    .sort((a,b) => {
      if (a.name > b.name) return 1;
      else if (a.name < b.name) return -1;
      else return 0;}) || [];
  }

  getTotalBudgeted(budget: Budget): number {
    let total = 0;
    budget.categories.forEach(category => total = total + category.amount!);
    return total;
  }

  getRemaining(budget: Budget, overflow?: number): number {
    if (overflow) {
      return budget.income! - this.getTotalBudgeted(budget) + overflow;
    }
    return budget.income! - this.getTotalBudgeted(budget);
  }

  calculateOverflow(budget: Budget, transactions: Transaction[]): void {
    budget.overflow = this.transactionService.getTotalIncome(transactions) - this.transactionService.getTotalSpent(transactions);
    // console.log(`Overflow calculated at: ${this.getTotalIncome() - this.getTotalSpent()}`);
    this.updateBudget(budget);
  }

  getCategoryNames(parent: string, budget: Budget): Category[] {
    let categoryNames: Category[] = [];
    // get all categories that would normally be there
    this.childCategories.filter(category => category.parent == parent).forEach(category => categoryNames.push(category));
    // get all categories that are custom to the budget
    budget.categories.filter(category => category.parent == parent && !categoryNames.includes(category)).forEach(category => categoryNames.push(category));
    
    return categoryNames;
  }
}
