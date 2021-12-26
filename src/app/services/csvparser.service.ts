import { Injectable } from '@angular/core';
import { Auth, authInstance$, authState, getAuth, updateCurrentUser, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CSVParsingProfile } from '../models/csvparsing-profile';

@Injectable({
  providedIn: 'root'
})
export class CsvparserService {

  currUser!: User | null;

  constructor(private firestore: Firestore,
    private auth: Auth) {
      //get currentUser
      this.currUser = auth.currentUser;
  }

  addParser(parser: CSVParsingProfile) {
    console.log(this.auth.currentUser);
    const parsersRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/parsers`);
    return addDoc(parsersRef, parser);
  }

  getParsers(): Observable<CSVParsingProfile[]> {
    const parsersRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/parsers`);
    return collectionData(parsersRef, {idField: 'id' }) as Observable<CSVParsingProfile[]>;
  }
}
