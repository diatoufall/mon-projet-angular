import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Add this import
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Add this import for standalone components

@Component({
  selector: 'app-login',
  standalone: true, // <-- Make sure your component is standalone
  imports: [FormsModule, CommonModule], // <-- Add FormsModule and CommonModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // These properties are needed for two-way data binding with ngModel
  username!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void { // <-- The login() method is defined here
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        this.router.navigate(['/protected']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}