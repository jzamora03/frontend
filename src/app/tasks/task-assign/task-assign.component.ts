import { Component, Input } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-assign',
  imports: [FormsModule],
  templateUrl: './task-assign.component.html',
  styleUrls: ['./task-assign.component.css']
})
export class TaskAssignComponent {
  @Input() taskId!: number;
  users: any[] = [];
  selectedUserId: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getUsers().subscribe(users => this.users = users);
  }

  assignTask(): void {
    console.log("Tarea seleccionada:", this.taskId, "Usuario seleccionado:", this.selectedUserId); 
  
    if (!this.taskId || !this.selectedUserId) {
      console.error("Error: Tarea o usuario no seleccionado.");
      return;
    }
  
    this.apiService.assignTask(this.taskId, this.selectedUserId).subscribe(
      response => {
        console.log("Tarea asignada correctamente:", response);
      },
      error => {
        console.error("Error al asignar tarea:", error);
      }
    );
  } 
}
