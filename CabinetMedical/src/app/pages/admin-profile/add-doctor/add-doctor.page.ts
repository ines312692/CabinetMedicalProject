import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.page.html',
  styleUrls: ['./add-doctor.page.scss'],
  standalone: false,
})
export class AddDoctorPage implements OnInit {
  doctorForm: FormGroup;
  selectedFile!: File;
  imagePreview!: string | ArrayBuffer; // Pour l'aperçu de l'image

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private router: Router,
    private doctorService: DoctorService
  ) {
    this.doctorForm = this.formBuilder.group({
      name: ['', Validators.required],
      specialty: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{8}$') // Validation pour 8 chiffres
      ]],
      email: ['', [Validators.required, Validators.email]], // Validation de l'email
      password: ['', [Validators.required, Validators.minLength(8)]], // Validation du mot de passe
    });
  }

  ngOnInit() {
    this.onFormChanges();
  }

  // Méthode pour détecter les changements de valeur dans le formulaire
  onFormChanges() {
    this.doctorForm.valueChanges.subscribe((value) => {
      for (const controlName in this.doctorForm.controls) {
        const control = this.doctorForm.get(controlName);
        if (control && control.invalid && (control.dirty || control.touched)) {
          this.handleFormFieldError(controlName, control);
        }
      }
    });
  }

  // Gestion des erreurs de chaque champ du formulaire
  async handleFormFieldError(controlName: string, control: any) {
    let message = '';
    let message2 = '';

    if (control.hasError('email')) {
      message = 'L\'email n\'est pas valide.';
    } else if (control.hasError('pattern') && controlName === 'phone') {
      message = 'Le téléphone doit contenir exactement 8 chiffres.';
    } else if (control.hasError('minlength') && controlName === 'password') {
      message = 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    else if (control.hasError('required')) {
      message2 = 'tous les champs sont obligatoires.';
    }
    if (message || message2) {
      await this.presentToast(message +message2, 'danger');
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Générer un aperçu de l'image sélectionnée
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagePreview = reader.result as string | ArrayBuffer; // Assurez-vous que ce n'est pas null
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Soumettre le formulaire
  onSubmit() {
    if (this.doctorForm.invalid || !this.selectedFile) {
      this.showFormErrors();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.doctorForm.get('name')?.value);
    formData.append('specialty', this.doctorForm.get('specialty')?.value);
    formData.append('description', this.doctorForm.get('description')?.value);
    formData.append('address', this.doctorForm.get('address')?.value);
    formData.append('phone', this.doctorForm.get('phone')?.value);
    formData.append('email', this.doctorForm.get('email')?.value);
    formData.append('password', this.doctorForm.get('password')?.value);
    formData.append('image', this.selectedFile);

    this.doctorService.addDoctor(formData).subscribe({
      next: async (response: any) => {
        console.log('Médecin ajouté avec succès', response);
        await this.presentToast('Médecin ajouté avec succès!', 'success');
        this.router.navigate(['/doctors']);
      },
      error: async (error: any) => {
        console.error("Erreur lors de l'ajout du médecin", error);
        await this.presentToast("Erreur lors de l'ajout du médecin.", 'danger');
      },
    });
  }

  // Afficher le toast
  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }

  // Afficher les erreurs du formulaire sous forme de toast
  async showFormErrors() {
    const controls = this.doctorForm.controls;
    for (const controlName in controls) {
      const control = controls[controlName];
      if (control.invalid && (control.dirty || control.touched)) {
        await this.handleFormFieldError(controlName, control);
      }
    }
  }
}
