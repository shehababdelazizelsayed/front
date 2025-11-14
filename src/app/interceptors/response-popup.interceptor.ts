// import { Injectable } from '@angular/core';
// import {
//     HttpRequest,
//     HttpHandler,
//     HttpEvent,
//     HttpInterceptor,
//     HttpResponse,
//     HttpErrorResponse
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { NotificationService } from '../services/notification.service';

// @Injectable()
// export class ResponsePopupInterceptor implements HttpInterceptor {

//     constructor(private notificationService: NotificationService) { }

//     intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

//         return next.handle(request).pipe(
//             // 1. Handle Success
//             tap((event: HttpEvent<any>) => {
//                 // We must check if the event is an HttpResponse
//                 if (event instanceof HttpResponse) {

//                     // We only want to show popups for mutating requests (POST, PUT, DELETE)
//                     // GET requests usually don't need a success popup.
//                     if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {

//                         // Assuming the server returns a simple { message: '...' } on success
//                         const successMessage = event.body?.message || 'Operation completed successfully!';
//                         this.notificationService.showSuccess(successMessage);
//                     }
//                 }
//             }),

//             // 2. Handle Errors
//             catchError((error: HttpErrorResponse) => {
//                 // Default error message
//                 let errorMessage = 'An unknown error occurred!';

//                 // Try to get a specific message from the server response
//                 if (error.error instanceof ErrorEvent) {
//                     // Client-side error
//                     errorMessage = `Error: ${error.error.message}`;
//                 } else {
//                     // Server-side error
//                     // We assume the server sends an error object like { message: '...' }
//                     errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
//                 }

//                 this.notificationService.showError(errorMessage);

//                 // IMPORTANT: We must re-throw the error so that the calling service/component
//                 // can handle it further (e.g., stop a loading spinner).
//                 return throwError(() => error);
//             })
//         );
//     }
// }
