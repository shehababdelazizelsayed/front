import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  Role?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getRole(): string | null {
    const token = localStorage.getItem('jwt');
    if (!token) return null;

    try {
      const decoded: JwtPayload = jwtDecode(token);
      return decoded.Role ? decoded.Role.toLowerCase() : null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
