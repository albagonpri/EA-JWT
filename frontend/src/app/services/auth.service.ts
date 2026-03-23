import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export type UserRole = 'admin' | 'user';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  organizacion: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  organizacion: string;
  role: UserRole;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  usuario: AuthUser;
}

export interface Usuario {
  _id: string;
  name: string;
  email: string;
  organizacion: any;
  role: UserRole;
}

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'auth_user';
const API_URL = 'http://localhost:1337';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${API_URL}/usuarios`, payload).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      })
    );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.saveToken(res.accessToken);
        })
      );
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, payload, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.saveToken(res.accessToken);
          this.saveUser(res.usuario);
          this.router.navigate(['/home']);
        })
      );
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API_URL}/usuarios`);
  }

  getAdminPanel(): Observable<any> {
    return this.http.get(`${API_URL}/admin/panel`);
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getRole(): UserRole | null {
    return this.getUser()?.role ?? null;
  }

  hasRole(role: UserRole): boolean {
    return this.getRole() === role;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.http.post(`${API_URL}/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {},
      error: () => {}
    });

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/login']);
  }
}