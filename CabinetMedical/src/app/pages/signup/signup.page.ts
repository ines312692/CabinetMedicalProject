import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, SignupData } from 'src/app/services/auth.service';
import {IonicModule} from "@ionic/angular";
import {NgIf} from "@angular/common";
=======
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, SignupData } from 'src/app/services/auth.service';
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
<<<<<<< HEAD
  imports: [
    IonicModule,
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true
=======
  standalone: false
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da
})
export class SignupPage implements OnInit {
  form: FormGroup;

<<<<<<< HEAD
  constructor(private authService: AuthService, private router: Router) {
=======
  constructor(private authService: AuthService, private router: Router) { 
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da
    this.form = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      birthDate: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl(null, [Validators.required])
    }, { validators: this.passwordMatchValidator }); // Validation personnalisée
  }

  ngOnInit() {}

<<<<<<< HEAD

  minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) return null;

=======
  
  minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) return null;
      
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
<<<<<<< HEAD

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

=======
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da
      return age >= minAge ? null : { underage: true };
    };
  }
  passwordMatchValidator: ValidatorFn = (form: AbstractControl): { [key: string]: boolean } | null => {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  };

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const signupData: SignupData = {
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      birthDate: this.form.get('birthDate')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    };

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        console.log('Signup successful', response);
<<<<<<< HEAD
        this.router.navigate(['/login']);

=======
    this.router.navigate(['/login']);
      
>>>>>>> a1466ef77d73bc0405defc76acdad8d677bc86da
      },
      error: (error) => {
        console.error('Signup failed', error);
      }
    });
  }
}
