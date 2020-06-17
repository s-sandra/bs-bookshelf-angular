import { Injectable } from '@angular/core';
import { HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PopupService } from './popup.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private popup: PopupService) {}

  /**
   * Adds user access token to all HTTP requests.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // if access token available
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(cloned).pipe(
        tap(
          response => {},
          error => this.handleError(error)
        )
      );
    }
    return next.handle(request).pipe(
      tap(
        response => {},
        error => this.handleError(error)
      )
    );
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.popup.error('Permission denied. Sign into Google.');
      this.router.navigate(['/']);
    }
  }
}

