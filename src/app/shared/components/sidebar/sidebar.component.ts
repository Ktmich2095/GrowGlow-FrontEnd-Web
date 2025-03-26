import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const userName = localStorage.getItem('userName');
    if (userName) {
      this.userName = userName;  
    } else {
      this.userName = 'Invitado';
    }
  }
  

  logout(): void {
    this.authService.logout();
  }
}
