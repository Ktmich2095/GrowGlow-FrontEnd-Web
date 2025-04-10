import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings = {
    notifications: true,
    newsletter: true,
    theme: 'light'
  };

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.settings$.subscribe(settings => {
      this.settings = {...settings};
    });
  }

  changeTheme(theme: string) {
    this.settings.theme = theme;
    this.saveSettings();
  }

  saveSettings() {
    this.settingsService.updateSettings(this.settings);
  }

  onCheckboxChange() {
    this.saveSettings();
  }
}