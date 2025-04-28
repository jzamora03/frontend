import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      sessionStorage.setItem('redirectUrl', window.location.pathname);
      
      this.router.navigate(['/session-expired']);
      return false;
    }
    
    return true;
  }
}