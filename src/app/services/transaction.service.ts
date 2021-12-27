import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentReference, Firestore, limit, orderBy, query, setDoc, Timestamp, where, writeBatch } from '@angular/fire/firestore';
import { Observable, take } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  currUser: User | null;

  constructor(private firestore: Firestore,
    private auth: Auth) {
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
          console.log('Added transaction!');
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
    let q = query(transactionCollectionRef, orderBy('transDate', 'desc'));
    return collectionData(q, {idField: 'id' }) as Observable<Transaction[]>;
  }

  //get the transactions for a given month (int)
  getMonthlyTransactions(date: Date): Observable<Transaction[]> {
    console.log(`Getting transactions from ${date} to ${new Date(date.getFullYear(), date.getMonth() + 1)}`);
    const transactionCollectionRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/transactions`);
    let q = query(transactionCollectionRef,
      where('transDate', '>=', Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth()))),
      where('transDate', '<', Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth() + 1))),
      orderBy('transDate', 'desc'));
    return collectionData(q, {idField: 'id' }) as Observable<Transaction[]>;
  }
}
