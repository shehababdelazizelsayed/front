import { Component } from '@angular/core';
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

  constructor(private router: Router) {}

  onSubmit() {
    if (this.form.password !== this.form.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    // TODO: Implement registration logic
    console.log('Form submitted:', this.form);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
