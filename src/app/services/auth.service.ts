import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs'; // Ajoute BehaviorSubject ici
import { tap } from 'rxjs/operators'; // Ajoute tap ici

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4000/users';
  private loggedIn = new BehaviorSubject<boolean>(false); // Crée une propriété pour l'état de connexion

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.loggedIn.next(true);
    }
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((res) => {
        this.saveToken(res.token);
        this.loggedIn.next(true); // Met à jour l'état après une connexion réussie
      })
    );
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getProfile() {
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false); // Met à jour l'état après la déconnexion
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable(); // Ajoute cette méthode pour le guard
  }
}