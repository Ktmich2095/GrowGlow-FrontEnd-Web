import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @Input() usuario: { nombre?: string; email?: string; diasConsecutivos?: number } = {
    nombre: 'Usuario',
    email: 'Correo no disponible',
    diasConsecutivos: 0
  };
}
