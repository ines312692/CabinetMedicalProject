import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PubserviceService } from 'src/app/services/pubservice.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-pub',
  templateUrl: './add-pub.page.html',
  styleUrls: ['./add-pub.page.scss'],
  standalone: false,
})
export class AddPubPage implements OnInit {
  pubForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = false;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private pubservice: PubserviceService,
    private toastController: ToastController
  ) {
    this.pubForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      dateFin: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.generateImagePreview();
    }
  }

  private generateImagePreview(): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedImage as Blob);
  }

  async onSubmit(): Promise<void> {
    // Vérifier si le formulaire est valide et qu'une image a été sélectionnée
    if (this.pubForm.invalid || !this.selectedImage) {
      if (this.pubForm.get('titre')?.invalid) {
        await this.presentToast('Le titre est obligatoire', 'danger');
      } else if (this.pubForm.get('description')?.invalid) {
        await this.presentToast('La description est obligatoire', 'danger');
      } else if (this.pubForm.get('dateFin')?.invalid) {
        await this.presentToast('La date de fin est obligatoire', 'danger');
      } else if (!this.selectedImage) {
        await this.presentToast('Veuillez sélectionner une image', 'danger');
      }
      return;
    }
  
    // Marquer l'état de chargement comme vrai
    this.isLoading = true;
  
    try {
      // Créer le FormData avec les informations du formulaire et l'image
      const formData = this.createFormData();
  
      // Attendre la réponse de l'appel à l'API
      await this.pubservice.addPub(formData).toPromise();
  
      // Si l'ajout est réussi, afficher un message de succès
      await this.presentToast('Publicité ajoutée avec succès!', 'success');
  
      // Réinitialiser le formulaire
      this.resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      // Si une erreur se produit, afficher un message d'erreur
      await this.presentToast('Une erreur est survenue lors de l\'ajout.', 'danger');
    } finally {
      // Réinitialiser l'état de chargement après la soumission
      this.isLoading = false;
    }
  }
  
  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('titre', this.pubForm.get('titre')?.value);
    formData.append('description', this.pubForm.get('description')?.value);
    formData.append('dateFin', this.pubForm.get('dateFin')?.value);
    formData.append('image', this.selectedImage as Blob);
    return formData;
  }

  resetForm(): void {
    this.pubForm.reset();
    this.selectedImage = null;
    this.imagePreview = null;
  }

  private async presentToast(message: string, color: string = 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }
}
