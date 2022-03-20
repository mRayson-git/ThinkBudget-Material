import { Injectable } from '@angular/core';
import { Auth, authInstance$, authState, getAuth, updateCurrentUser, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentReference, Firestore, orderBy, query } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
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

  addParser(parser: CSVParsingProfile): Promise<DocumentReference> {
    const parsersRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/parsers`);
    return addDoc(parsersRef, parser);
  }

  getParsers(): Observable<CSVParsingProfile[]> {
    const parsersRef = collection(this.firestore, `${this.currUser?.uid}/thinkbudget/parsers`);
    let q = query(parsersRef, orderBy("profileName"));
    return collectionData(q, {idField: 'id' }) as Observable<CSVParsingProfile[]>;
  }

  updateParser(parser: CSVParsingProfile){
    const parserDocRef = doc(this.firestore, `${this.currUser?.uid}/thinkbudget/parsers/${parser.id}`);
    return setDoc(parserDocRef, parser);
  }

  deleteParser(parser: CSVParsingProfile): Promise<void> {
    const parserDocRef = doc(this.firestore, `${this.currUser?.uid}/thinkbudget/parsers/${parser.id}`);
    return deleteDoc(parserDocRef);
  }
}
