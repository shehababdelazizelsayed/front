import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';


@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
