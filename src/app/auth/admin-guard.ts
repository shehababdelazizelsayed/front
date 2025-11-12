import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  Role?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('jwt');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const userRole = decoded.Role;

      if (userRole === 'admin') {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    } catch (error) {
      console.error('Invalid JWT', error);
      this.router.navigate(['/']);
      return false;
    }
  }
}
