import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router} from '@angular/router';


@Component({
  selector: 'app-session-expired',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.css'] 
})

export class SessionExpiredComponent {
  message = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
  countdown: number = 5;
  private timerInterval: any;
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startCountdown(): void {
    this.timerInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timerInterval);
        this.goToLogin();
      }
    }, 1000);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}