import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-success-toast',
  standalone: false,
  templateUrl: './success-toast.component.html',
})
export class SuccessToastComponent implements OnInit {
  private successSubject = new Subject<string>();
  success$ = this.successSubject.asObservable();
  message = '';

  ngOnInit() {
    console.log('✅ SuccessToastComponent initialized');
    this.success$.subscribe((msg) => {
      console.log('🎉 Received success message:', msg);
      this.message = msg;
      setTimeout(() => (this.message = ''), 4000);
    });
  }

  show(message: string) {
    this.successSubject.next(message);
  }

  hide() {
    this.message = '';
  }
}
