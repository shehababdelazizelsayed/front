import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  // Shows a success message
  showSuccess(message: string, title: string = 'Success'): void {
    alert(`${title}: ${message}`);
  }

  // Shows an error message
  showError(message: string, title: string = 'Error'): void {
    alert(`${title}: ${message}`);
  }

  // You can add showWarning, showInfo etc.
}
