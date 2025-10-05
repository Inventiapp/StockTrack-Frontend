import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [],
})
export class HomeComponent {
  title = 'Bienvenido a StockTrack';
  subtitle = 'Sistema de gestión de inventario';
}

