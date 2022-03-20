import { Transaction } from "./transaction";

export interface HistoricalData {
    lastUpdated: Date,
    transactions: Transaction[]
}
