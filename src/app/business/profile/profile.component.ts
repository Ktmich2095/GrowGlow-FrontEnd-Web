import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RachaService } from '../../core/services/racha.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  usuario = {
    nombre: 'Usuario',

    diasConsecutivos: 0
  };

  constructor(private authService: AuthService, private rachaService: RachaService) {}

  ngOnInit(): void {
    // Obtén el nombre y correo del usuario desde AuthService
    const nombre = this.authService.getUserName();
    const token = this.authService.getToken();

    if (token) {
      try {
        // Decodifica el token para obtener información adicional
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.usuario.nombre = nombre || 'Usuario';
      } catch (e) {
        console.error('Error al decodificar el token:', e);
      }
    }

    // Obtén la racha desde RachaService
    this.usuario.diasConsecutivos = this.rachaService.obtenerRacha();
  }
}
