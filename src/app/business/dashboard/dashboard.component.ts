import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../core/services/web-socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports:[FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sensorData: any = {};

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.observeSensorData().subscribe(data => {
      this.sensorData = data;
    });
  }
}
