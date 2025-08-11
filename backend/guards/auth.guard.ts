import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:4000/users';
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Vérifie si un token existe déjà dans le stockage local
    const token = localStorage.getItem('token');
    if (token) {
      this.loggedIn.next(true);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Stocke le token et met à jour l'état de connexion
        localStorage.setItem('token', response.token);
        this.loggedIn.next(true);
      })
    );
  }

  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  logout(): void {
    // Supprime le token et met à jour l'état de connexion
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  // Cette méthode retourne l'état de connexion sous forme d'Observable
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}