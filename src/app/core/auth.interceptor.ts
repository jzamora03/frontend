import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continuar con la solicitud y capturar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Verificar si es un error de autenticación (401) o de autorización (403)
        if (error.status === 401 || error.status === 403) {
          console.log('Error de autenticación detectado, redirigiendo...');
          // Almacenar la URL actual para redirigir después del login
          sessionStorage.setItem('redirectUrl', window.location.pathname);
          // Redirigir a la página de sesión expirada
          this.router.navigate(['/session-expired']);
        }
        return throwError(() => error);
      })
    );
  }
}