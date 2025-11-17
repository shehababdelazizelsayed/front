import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ResponsePopupInterceptor implements HttpInterceptor {
    constructor(private notificationService: NotificationService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        console.log('[Interceptor] outgoing request:', request.method, request.url); // test

        return next.handle(request).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('[Interceptor] got response for:', request.method, request.url); // test

                    const method = request.method.toUpperCase();
                    const isMutating =
                        method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';

                    if (isMutating) {
                        const successMessage = event.body?.message || 'Operation completed successfully.';
                        this.notificationService.showSuccess(successMessage);
                    }
                }
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('[Interceptor] caught error for:', request.method, request.url, error); // test

                let errorMessage = 'An unknown error occurred.';

                if (error.error instanceof ErrorEvent) {
                    errorMessage = error.error.message || errorMessage;
                } else {
                    errorMessage =
                        error.error?.message ||
                        error.message ||
                        `Error Code: ${error.status}. Please try again later.`;
                }

                this.notificationService.showError(errorMessage);

                return throwError(() => error);
            }),
        );
    }
}
