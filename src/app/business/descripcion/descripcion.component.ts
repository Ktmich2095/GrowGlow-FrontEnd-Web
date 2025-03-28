import { Component, OnInit } from '@angular/core';
import { SabiasQueService } from '../../core/services/sabias-que.service';

@Component({
  selector: 'app-descripcion',
  standalone: true,
  imports: [],
  templateUrl: './descripcion.component.html',
  styleUrl: './descripcion.component.css'
})
export class DescripcionComponent implements OnInit {
  datoCurioso: string = '';

  constructor(private sabiasQueService: SabiasQueService) {}

  ngOnInit(): void {
    let indice = localStorage.getItem('datoCuriosoIndex');

    if (!indice) {
      indice = Math.floor(Math.random() * this.sabiasQueService.datosCuriosos.length).toString();
      localStorage.setItem('datoCuriosoIndex', indice);
    }

    this.datoCurioso = this.sabiasQueService.getDatoCurioso();
  }
}
