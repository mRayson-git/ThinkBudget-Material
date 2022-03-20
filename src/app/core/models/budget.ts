import { Timestamp } from "@angular/fire/firestore";
import { Category } from "./category";
import { CategoryStats } from "./categoryStats";

export interface Budget {
    id?: string,
    date: Timestamp
    income: number,
    budgetStats?: {
        totalIncome: number,
        totalSaved: number,
        totalSpent: number,
        categoryStats?: CategoryStats[]
    },
    overflow?: number,
    categories: Category[]
}
