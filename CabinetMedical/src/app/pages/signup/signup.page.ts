import { Component, OnInit,ElementRef, ViewChild  } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, SignupData } from 'src/app/services/auth.service';
import {IonicModule} from "@ionic/angular";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true
})


  export class SignupPage implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef;
    form: FormGroup;
    imagePreview: string | ArrayBuffer | null = null;
    selectedFile: File | null = null;
  
    constructor(private authService: AuthService, private router: Router) {
      this.form = new FormGroup({
        firstName: new FormControl(null, [Validators.required]),
        lastName: new FormControl(null, [Validators.required]),
        birthDate: new FormControl(null, [Validators.required, this.minimumAgeValidator(16)]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        phone: new FormControl(null, [Validators.pattern('^[0-9]{10}$')]),
        allergies: new FormControl(null),
        password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl(null, [Validators.required]),
        image: new FormControl(null)
      }, { validators: this.passwordMatchValidator });
    }
  
    ngOnInit() {}
  
    onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        this.selectedFile = file;
  
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }

    triggerFileInputClick(): void {
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  
    minimumAgeValidator(minAge: number): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (!control.value) return null;
  
        const birthDate = new Date(control.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
  
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
  
        return age >= minAge ? null : { underage: true };
      };
    }
  
    passwordMatchValidator: ValidatorFn = (form: AbstractControl): { [key: string]: boolean } | null => {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;
      return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
    };
    isSubmitting = false;
    onSubmit() {
      if (this.isSubmitting) return;
  
  this.isSubmitting = true;
      if (!this.form.valid) {
        this.form.markAllAsTouched();
        return;
      }
    
      const formData = new FormData();
      formData.append('firstName', this.form.get('firstName')?.value);
      formData.append('lastName', this.form.get('lastName')?.value);
      formData.append('birthDate', this.form.get('birthDate')?.value);
      formData.append('email', this.form.get('email')?.value);
      formData.append('password', this.form.get('password')?.value);
      
      if (this.form.get('phone')?.value) {
        formData.append('phone', this.form.get('phone')?.value);
      }
      if (this.form.get('allergies')?.value) {
        formData.append('allergies', this.form.get('allergies')?.value);
      }
      
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
    
      this.authService.signup(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          console.log('Signup successful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Signup failed', error);
          if (error.status === 409) {
            // Email already exists
            this.form.get('email')?.setErrors({ emailExists: true });
          } else {
            // Other errors
            alert('An error occurred during signup. Please try again.');
          }
        }
      });
    }

    triggerFileInput() {
      this.fileInput.nativeElement.click();
    }
  }
