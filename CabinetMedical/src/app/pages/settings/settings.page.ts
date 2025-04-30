import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme-service.service';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    IonicModule,
    FormsModule
  ],
  standalone: true
})
export class SettingsPage {
  notificationsEnabled: boolean = true;

  constructor(private themeService: ThemeService) {}

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
