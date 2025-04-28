import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ApiService } from '../../core/api.service';
import { MatTableModule } from '@angular/material/table'; 
import { MatSelectModule } from '@angular/material/select'; 
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { NgCircleProgressModule } from 'ng-circle-progress';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, 
    MatSelectModule, 
    RouterModule, 
    MatChipsModule,
    MatBadgeModule,
    NgCircleProgressModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  Allindicators = { total_tasks: 0, pending_tasks: 0, completed_tasks: 0, progress_percentage: 0  };
  tasksByWeek: any[] = [];


  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  

    this.apiService.getIndicators().subscribe(
      (indicators) => this.Allindicators = indicators,
      (error) => console.error('Error al obtener indicadores:', error)
    );  

    this.apiService.getAllIndicators().subscribe(indicators => {
      this.Allindicators = indicators; 
    });

    this.apiService.getTasksCompletedByWeek().subscribe(data => {
      this.tasksByWeek = data.map(entry => ({
        week: `Semana ${entry.week}`,
        count: entry.count
      }));
    });
  
  

  }

  deleteTask(id: number): void {
    this.apiService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== id);
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pendiente': return 'warning';   
      case 'en progreso': return 'primary'; 
      case 'completada': return 'success'; 
      default: return 'secondary';
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getProgressArc(): string {
    const percentage = this.Allindicators.progress_percentage || 0;
    const circumference = 2 * Math.PI * 40;
    return `${(circumference * percentage) / 100} ${circumference}`;
  }
  
  logout(): void {
    localStorage.removeItem('auth_token'); 
    sessionStorage.removeItem('auth_token'); 
    this.router.navigate(['/login']);
    console.log("Sesión cerrada. Redirigiendo a login...");
  }
  
}