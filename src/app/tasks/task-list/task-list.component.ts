import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ApiService } from '../../core/api.service';
import { MatTableModule } from '@angular/material/table'; 
import { MatSelectModule } from '@angular/material/select'; 
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TaskAssignComponent } from '../task-assign/task-assign.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    RouterModule,
    MatChipsModule,
    MatBadgeModule,
    NgCircleProgressModule,

],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit {
  tasks: any[] = [];
  Allindicators = { total_tasks: 0, pending_tasks: 0, completed_tasks: 0, progress_percentage: 0  };
  tasksByWeek: any[] = [];
  taskId: number = 0;
  selectedUserId: number = 0;
  users: any[] = [];
  isModalOpen: boolean = false; 

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

    this.apiService.getUsers().subscribe(users => {
      this.users = users; 
    });

    this.apiService.getTasks().subscribe(tasks => {
      this.tasks = tasks.map((task: { user_assigned: any; }) => ({
        ...task,
        user_assigned: this.users.find(user => user.id === task.user_assigned) || null 
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

  openAssignTaskModal(taskId: number): void {
    this.taskId = taskId;
    this.selectedUserId = 0;
    this.isModalOpen = true;
    console.log("Tarea seleccionada:", this.taskId);
  }

  closeAssignTaskModal(): void {
    this.isModalOpen = false; 
  }

 
  onUserSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedUserId = Number(target.value);
    console.log("Usuario seleccionado:", this.selectedUserId);
  }
  

  assignTask(taskId: number, userId: number): void {
    console.log("Intentando asignar tarea con:", { taskId, userId });
  
    if (!taskId || !userId || userId === 0) {
      console.error("Error: Tarea o usuario no seleccionado.");
      alert("Por favor, selecciona un usuario antes de asignar la tarea.");
      return;
    }
  
    this.apiService.assignUser(taskId, userId).subscribe(
      response => {
        console.log("Usuario asignado correctamente:", response);
        
        this.tasks = this.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, user_assigned: this.users.find(user => user.id === userId) };
          }
          return task;
        });
        
        this.closeAssignTaskModal();
        location.reload();
      },
      error => {
        console.error("Error al asignar usuario:", error);
      }
    );
  }
}