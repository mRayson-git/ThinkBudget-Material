import { Component, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  isLogin: boolean = false;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    confirmPassword: new FormControl(null, Validators.required),
  });

  constructor(private route: ActivatedRoute,
    private router: Router,
    private auth: Auth) { }

  async ngOnInit(): Promise<void> {
    let result = await firstValueFrom(this.route.data);
    this.isLogin = result['isLogin'];
    console.log(this.loginForm.valid);
  }

  login(): void {
    signInWithEmailAndPassword(this.auth, this.loginForm.get('email')!.value, this.loginForm.get('password')!.value)
    .then(result => {
      console.log(`Logged in: ${result}`);
      this.router.navigateByUrl('');
    })
    .catch(err => console.log(`Failed to log in: ${err}`));
  }

  register(): void {
    createUserWithEmailAndPassword(this.auth, this.registerForm.get('email')!.value, this.registerForm.get('password')!.value)
    .then(result => {
      console.log(`Registered: ${result}`);
      this.router.navigateByUrl('');
    })
    .catch(err => console.log(`Failed to register user: ${err}`));
  }

}
