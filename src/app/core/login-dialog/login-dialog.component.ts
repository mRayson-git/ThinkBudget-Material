import { Component, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { checkPasswords } from '../validators/password';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  isRegistered: boolean = true;
  accountForm: FormGroup = new FormGroup({
    email: new FormControl([''], Validators.required),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  }, { validators: checkPasswords });

  constructor(public loginDialogRef: MatDialogRef<LoginDialogComponent>,
    public auth: Auth) { }


  ngOnInit(): void { }

  toggleRegister() {
    this.isRegistered = !this.isRegistered;
  }

  login(): void {
    console.log(this.accountForm.get('email')!.value);
    signInWithEmailAndPassword(this.auth, this.accountForm.get('email')?.value, this.accountForm.get('password')?.value)
    .then(result => {
      console.log(`Signed in! ${result}`);
      this.loginDialogRef.close();
    })
    .catch(err => console.log(err));
  }

  create(): void {
    console.log('Creating user!');
    createUserWithEmailAndPassword(this.auth, this.accountForm.get('email')?.value, this.accountForm.get('password')?.value)
    .then(result => {
      console.log(`Created user! ${result}`);
      this.loginDialogRef.close();
    })
    .catch(err => console.log(err));
  }

  isInValid(formControlName: string): boolean | undefined {
    return !this.accountForm.get(formControlName)!.valid && this.accountForm.get(formControlName)!.touched;
  }

}
