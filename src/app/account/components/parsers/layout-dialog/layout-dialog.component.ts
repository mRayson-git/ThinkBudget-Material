import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-layout-dialog',
  templateUrl: './layout-dialog.component.html',
  styleUrls: ['./layout-dialog.component.scss']
})
export class LayoutDialogComponent implements OnInit {

  constructor(public layoutDialogRef: MatDialogRef<LayoutDialogComponent>,
    public auth: Auth) {
      //login user here
    }

  ngOnInit(): void {
  }

  saveLayout(): void {
    //save layout to firestore
  }

  close(): void {
    this.layoutDialogRef.close();
  }

}
