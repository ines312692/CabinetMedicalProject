import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme-service.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule, // Corrected: Use ReactiveFormsModule instead of FormsModule
    NgIf,
    FormsModule
  ],
  standalone: true
})
export class SettingsPage implements OnInit {
  notificationsEnabled: boolean = true;
  form: FormGroup;
  userId: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private toastController: ToastController // Added for user feedback
  ) {
    this.form = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      birthDate: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.minLength(8)]),
      confirmPassword: new FormControl(null)
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.loadUserData();
    }
  }

  loadUserData() {
    if (!this.userId) return;
    this.authService.getUser(this.userId).subscribe({
      next: (response: any) => {
        this.form.patchValue({
          firstName: response.first_name,
          lastName: response.last_name,
          birthDate: response.birth_date,
          email: response.email
        });
      },
      error: (error: any) => {
        console.error('Failed to load user data', error);
        this.presentToast('Failed to load user data', 'danger');
      }
    });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control instanceof FormGroup) {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
    }
    return null;
  };

  async onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      await this.presentToast('Please fill all required fields correctly', 'warning');
      return;
    }

    if (!this.userId) {
      console.error('User ID is missing');
      await this.presentToast('User ID is missing', 'danger');
      return;
    }

    const formData: any = {
      first_name: this.form.get('firstName')?.value,
      last_name: this.form.get('lastName')?.value,
      birth_date: this.form.get('birthDate')?.value,
      email: this.form.get('email')?.value
    };

    if (this.form.get('password')?.value) {
      formData['password'] = this.form.get('password')?.value;
    }

    this.authService.updateUser(this.userId, formData).subscribe({
      next: async (response: any) => {
        console.log('Update successful', response);
        await this.presentToast('Profile updated successfully', 'success');
        this.router.navigate(['/settings']);
      },
      error: async (error: any) => {
        console.error('Update failed', error);
        await this.presentToast('Failed to update profile', 'danger');
      }
    });
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
