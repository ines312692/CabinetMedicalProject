import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService, LoginData } from "../../services/auth.service";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true
})
export class LoginPage implements OnInit {

  form: FormGroup | any;
  loginError: string | null = null;

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) {
    this.initForm();
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color
    });
    await toast.present();
  }

  ngOnInit() {}

  initForm() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const loginData: LoginData = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    };

    this.authService.login(loginData).subscribe({
      next: (response: { role: string }) => {
        console.log('Login successful', response);
        this.presentToast('Connexion réussie!', 'success');

        // Redirection selon le rôle
        if (response.role === 'doctor') {
          this.router.navigate(['/doctor-profile']);
        } else if (response.role === 'patient') {
          this.router.navigate(['/home']);
        } else if (response.role === 'admin') {
          this.router.navigate(['/admin-profile']);
        }
      },
      error: (error: { error: { error: string } }) => {
        console.error('Login failed', error);
        const errorMessage = error.error?.error || 'Erreur de connexion. Vérifiez vos identifiants.';
        this.presentToast(errorMessage);
      }
    });
  }
}
