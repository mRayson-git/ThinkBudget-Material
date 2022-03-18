import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentReference, Firestore, limit, orderBy, Query, query, setDoc, Timestamp, where } from '@angular/fire/firestore';
import { Observable, take } from 'rxjs';
import { Category } from '../models/category';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  currUser: User | null;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.currUser = auth.currentUser;
  }

  // import transactions from file
  batchSave(transactions: Transaction[]) {
    console.log('Calling batch save');
    const transactionCollectionRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/transactions`);
    // get the account we're adding transactions for
    const bankAccountName = transactions[0].bankAccountName;
    // get the most recent transaction for that account
    this.getMostRecent(bankAccountName).pipe(take(1)).subscribe(mostRecent => {
      if (mostRecent[0]) {
        transactions.forEach(transaction => {
          if (transaction.transDate > mostRecent[0].transDate) {
            addDoc(transactionCollectionRef, transaction);
          } else {
            console.log('Transaction skipped (same day / ealier than most recent)');
          }
        });
        return;
      } else {
        // no transactions for this account in the system (1st import)
        transactions.forEach(transaction => {
          console.log(`Adding transaction: ${JSON.stringify(transaction)}`);
          addDoc(transactionCollectionRef, transaction);
        });
      }
    });
  }

  // add custom transaction
  createTransaction(transaction: Transaction): Promise<DocumentReference> {
    const transactionCollectionRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/transactions`);
    return addDoc(transactionCollectionRef, transaction);
  }

  getMostRecent(accountName: string): Observable<Transaction[]> {
    const transactionCollectionRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/transactions`);
    const q = query(transactionCollectionRef, limit(1), orderBy('transDate', 'desc'), where('bankAccountName', '==', accountName));
    return collectionData(q, {idField: 'id' }) as Observable<Transaction[]>;
  }

  // update transaction
  updateTransaction(transaction: Transaction): Promise<void> {
    const transactionDocRef = doc(this.firestore, `${this.currUser?.uid}/thinkbudget/transactions/${transaction.id}`);
    return setDoc(transactionDocRef, transaction);
  }

  // delete transaction
  deleteTransaction(transaction: Transaction): Promise<void> {
    const transactionDocRef = doc(this.firestore, `${this.currUser?.uid}/thinkbudget/transactions/${transaction.id}`);
    return deleteDoc(transactionDocRef);
  }

  // read all transactions
  getTransactions(): Observable<Transaction[]> {
    const transactionCollectionRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/transactions`);
    let q: Query;
    // // Check if there exists historical data for transactions
    // if (localStorage.getItem('HISTORICAL_DATA')) {
    //   let historicalTransactions: Transaction[] = JSON.parse(localStorage.getItem('HISTORICAL_DATA')!).transactions;
    //   // Get the most recent transaction from historical data
    //   let mostRecent = historicalTransactions.pop();
    //   // Get transactions from firebase with a data value greater than or equal to this transaction
    //   q = query(transactionCollectionRef, where('transDate', ">=", mostRecent!.transDate))
    //   collectionData(q, {idField: 'id'}).subscribe(transactions => {
    //     transactions.forEach(transaction => {
    //       if (transaction.trans)
    //     });
    //   });
    // }
    
    q = query(transactionCollectionRef, orderBy('transDate', 'desc'));
    return collectionData(q, {idField: 'id' }) as Observable<Transaction[]>;
  }

  getTransactionsInTimeframe(periodStart: Date, periodEnd: Date): Observable<Transaction[]> {
    const transactionCollectionRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/transactions`);
    let q = query(transactionCollectionRef,
      where('transDate', '>=', Timestamp.fromDate(new Date(periodStart.getFullYear(), periodStart.getMonth()))),
      where('transDate', '<', Timestamp.fromDate(new Date(periodEnd.getFullYear(), periodEnd.getMonth() + 1))),
      orderBy('transDate', 'desc'));
    return collectionData(q, {idField: 'id' }) as Observable<Transaction[]>;
  }

  //get the transactions for a given month (int)
  getMonthlyTransactions(date: Date): Observable<Transaction[]> {
    // console.log(`Getting transactions from ${date} to ${new Date(date.getFullYear(), date.getMonth() + 1)}`);
    const transactionCollectionRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/transactions`);
    let q = query(transactionCollectionRef,
      where('transDate', '>=', Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth()))),
      where('transDate', '<', Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth() + 1))),
      orderBy('transDate', 'desc'));
    return collectionData(q, {idField: 'id' }) as Observable<Transaction[]>;
  }

  getVariableTransactions(num: number): Observable<Transaction[]> {
    const transactionCollectionRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/transactions`);
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - num);

    let q = query(transactionCollectionRef,
      where('transDate', '>=', Timestamp.fromDate(startDate)),
      where('transDate', '<=', Timestamp.fromDate(endDate)),
      orderBy('transDate', 'desc'));
    return collectionData(q, {idField: 'id' }) as Observable<Transaction[]>;
  }


  // Stat calculating methods 
  // get total spent
  getTotalSpent(transactions: Transaction[]): number {
    let total = 0;
    transactions.forEach(transaction => {
      // if (transaction.transCategory?.name == "Ignored") console.log(transaction);
      if (transaction.transCategory?.parent != "Income" && transaction.transCategory?.name != "Ignored") {
        total = total - transaction.transAmount;
      }
    });
    return total;
  }

  getTotalSpentForCategory(transactions: Transaction[], category: Category): number {
    let total = 0;
    transactions.forEach(transaction => {
      if (transaction.transCategory?.parent == category.parent && transaction.transCategory.name == category.name) total = total + transaction.transAmount;
    })
    return Math.abs(total);
  }

  // get total saved
  getTotalSaved(transactions: Transaction[]): number {
    let total = 0;
    transactions.forEach(transaction => {
      // minus since the money is leaving for a savings account
      if (transaction.transCategory?.parent == "Saving") total = total - transaction.transAmount;
    });
    return total;
  }

  // get total outgoing
  getTotalOutgoing(transactions: Transaction[]): number {
    return this.getTotalSpent(transactions) - this.getTotalSaved(transactions);
  }

  // get total income
  getTotalIncome(transactions: Transaction[]): number {
    let total = 0;
    transactions.forEach(transaction => {
      if (transaction.transCategory?.parent == "Income") total = total + transaction.transAmount;
    });
    return total;
  }
}
