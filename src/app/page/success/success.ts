import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { PaymentVerificationResult } from '../../models/success.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './success.html',
  styleUrls: ['./success.css'],
})
export class Success {
  sessionId: string | null = null;
  verifying = true;
  verified = false;
  failed = false;
  orderId?: string;
  amount?: number;
  manualSessionId: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private api: Api) {}

  ngOnInit(): void {
    // Prefer query param
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');

    // If not present, try localStorage (set by cart component before Stripe redirect)
    if (!this.sessionId) {
      this.sessionId = localStorage.getItem('stripe_session_id');
    }

    // If not present try navigation state (some flows pass data via router state)
    if (!this.sessionId) {
      try {
        const nav = (this.router as any).getCurrentNavigation?.();
        const stateSession = nav?.extras?.state?.sessionId || nav?.extras?.state?.session_id;
        if (stateSession) {
          this.sessionId = stateSession;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!this.sessionId) {
      // don't mark as failed immediately — provide the user a way to paste the id
      this.verifying = false;
      this.failed = false;
      return;
    }

    this.verifyPayment(this.sessionId);
  }

  verifyPayment(sessionId: string) {
    this.verifying = true;
    this.api.verifyPaymentSession(sessionId).subscribe({
      next: (res: PaymentVerificationResult | any) => {
        if (res && res.success) {
          this.verified = true;
          this.orderId = res.orderId || res.order?._id;
          this.amount = res.amount || res.order?.amount || res.total;
          localStorage.removeItem('stripe_session_id');
        } else {
          this.failed = true;
        }
      },
      error: (err: any) => {
        this.failed = true;
      },
      complete: () => {
        this.verifying = false;
      },
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goToOrders() {
    this.router.navigate(['/profile']);
  }
}
