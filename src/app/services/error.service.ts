import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errorSubject = new Subject<string>();

  get error$(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  show(message: string): void {
    this.errorSubject.next(message);
  }
}
