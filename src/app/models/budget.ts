import { Timestamp } from "@angular/fire/firestore";
import { Category } from "./category";

export interface Budget {
    id?: string,
    date: Timestamp
    income: number,
    budgetStats?: {
        totalIncome: number,
        totalSaved: number,
        totalSpent: number,
    },
    overflow?: number,
    categories: Category[]
}
