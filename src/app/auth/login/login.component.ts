import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../core/api.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private apiService: ApiService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // onSubmit(): void {
  //   if (this.loginForm.valid) {
  //     this.authService.login(this.loginForm.value).subscribe(
  //       (response) => {
  //         this.authService.setToken(response.token);
  //         this.router.navigate(['/tasks']);
  //       },
  //       (error) => {
  //         console.error('Error en el login:', error);
  //       }
  //     );
  //   }
  // }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          // Guardar el token
          this.authService.setToken(response.token);
          
          // Obtener la URL a la que el usuario intentaba acceder desde sessionStorage
          const redirectUrl = sessionStorage.getItem('redirectUrl') || '/tasks';
          
          // Limpiar la URL almacenada
          sessionStorage.removeItem('redirectUrl');
          
          console.log('Login exitoso, redirigiendo a:', redirectUrl);
          
          // Redirigir al usuario
          this.router.navigate([redirectUrl]);
        },
        (error) => {
          console.error('Error en el login:', error);
        }
      );
    }
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']); 
  }

}