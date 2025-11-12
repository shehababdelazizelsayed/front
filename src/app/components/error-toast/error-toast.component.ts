import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-error-toast',
  standalone: false,
  templateUrl: './error-toast.component.html',
})
export class ErrorToastComponent implements OnInit, OnDestroy {
  message = '';
  private sub?: Subscription;

  constructor(
    private errorService: ErrorService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.sub = this.errorService.error$.subscribe((msg) => {
      this.message = msg;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.message = '';
        this.cdr.detectChanges();
      }, 4000);
    });
  }

  hide(): void {
    this.message = '';
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
