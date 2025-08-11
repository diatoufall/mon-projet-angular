import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html', // <-- Correction du chemin
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router) { }

  register(): void {
    const credentials = { username: this.username, password: this.password };
    this.authService.register(credentials).subscribe({
      next: () => {
        console.log('Inscription réussie ! Veuillez vous connecter.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Échec de l\'inscription :', err);
      }
    });
  }
}