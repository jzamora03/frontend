import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; 

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-task-form',
  standalone: true,
  templateUrl: './task-form.component.html',
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule], 
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.maxLength(500)]], 
      status: ['pendiente', Validators.required], 
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
  
    if (this.taskId) {
      this.apiService.getTaskById(this.taskId).subscribe({
        next: (task) => {
          console.log("Tarea cargada:", task); 
          this.taskForm.patchValue(task); 
        },
        error: (err) => console.error("Error al obtener tarea:", err)
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
  
      console.log("Datos enviados para actualización:", taskData);
  
      if (this.taskId) {
        this.apiService.updateTask(this.taskId, taskData).subscribe({
          next: (response) => {
            console.log("Respuesta del servidor:", response); 
            this.router.navigate(['/tasks']);
          },
          error: (err) => console.error("Error al actualizar tarea:", err)
        });
      } else {
        this.apiService.createTask(taskData).subscribe(() => this.router.navigate(['/tasks']));
      }
    } else {
      console.error("Formulario inválido:", this.taskForm.errors);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  
}