import { Component, OnInit } from '@angular/core';
import { RachaService } from '../../core/services/racha.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  usuario = {
    nombre: 'Usuario de Prueba',
    email: 'usuario@ejemplo.com',
    diasConsecutivos: 0
  };

  constructor(private rachaService: RachaService) {}

  ngOnInit() {
    this.usuario.diasConsecutivos = this.rachaService.obtenerRacha();
  }
}
