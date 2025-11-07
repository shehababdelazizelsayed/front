import { Component } from '@angular/core';

@Component({
  selector: 'app-forget',
  standalone: false,
  templateUrl: './forget.html',
  styleUrl: './forget.css',
})
export class Forget {
  email = '';
  onSubmit() {
    console.log('Password reset requested');
  }
}
