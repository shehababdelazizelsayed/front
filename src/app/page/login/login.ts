import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  rememberMe = false;
  error = '';

  constructor(private api: Api, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.api.loginUser({ email: this.email, password: this.password }).subscribe({
      next: (response: any) => {
        if (response && response.token) {
          localStorage.setItem('jwt', response.token);
          this.router.navigate(['/']);
        } else {
          this.error = 'Invalid login response';
        }
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Login failed';
      },
    });
  }
}
