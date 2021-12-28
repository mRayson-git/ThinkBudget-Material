import { Timestamp } from "@angular/fire/firestore";
import { Category } from "./category";

export interface Transaction {
    id?: string,
    bankAccountName: string,
    bankAccountType?: string,
    transDate: Timestamp,
    transAmount: number,
    transPayee: string,
    transType: string,
    transNote?: string,
    transCategory?: Category,
}
