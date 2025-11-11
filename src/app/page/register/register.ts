import { Component } from '@angular/core';
import { Api } from '../../services/api';
import { Router } from '@angular/router';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form: RegisterForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  };

  constructor(private api: Api, private router: Router) {}

  error = '';

  onSubmit() {
    this.error = '';
    if (this.form.password !== this.form.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    const userData = {
      FirstName: this.form.firstName,
      LastName: this.form.lastName,
      Email: this.form.email,
      Password: this.form.password,
    };
    (this as any).api.registerUser(userData).subscribe({
      next: (response: any) => {
        // Registration successful, redirect to login
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Registration failed';
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
