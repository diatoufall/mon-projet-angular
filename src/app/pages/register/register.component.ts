import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) { }

  register(): void {
    // Appel de la méthode register du service avec les deux arguments
    this.authService.register(this.username, this.password).subscribe({
      next: (res) => {
        this.message = 'Inscription réussie ! Veuillez vous connecter.';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.message = 'Erreur d\'inscription : ' + err.error.error;
      }
    });
  }
}