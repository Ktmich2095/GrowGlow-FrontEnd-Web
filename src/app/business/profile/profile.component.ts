import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink],
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
