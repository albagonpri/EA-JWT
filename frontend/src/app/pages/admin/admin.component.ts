import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  loading = false;
  errorMessage = '';
  panelData: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPanel();
  }

  loadPanel(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.getAdminPanel().subscribe({
      next: (data) => {
        this.panelData = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'No se pudo cargar el panel de administración';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}