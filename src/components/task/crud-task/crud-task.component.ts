import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TaskService } from '../task-service.service';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-crud-task',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
    MatTooltipModule,
  ],
  templateUrl: './crud-task.component.html',
  styleUrl: './crud-task.component.css',
})
export class CrudTaskComponent {
  taskForm!: FormGroup;
  taskData: any;
  mode: string = 'NEW';
  header: string = 'Add Task';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CrudTaskComponent>,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      dueDate: [[Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const task = this.taskForm.value;
      task.dueDate = task.dueDate.toISOString();
      task.isTaskCompleted = false;
      task.isDeleted = false;

      if (this.mode === 'EDIT') {
        this.taskService
          .updateTask(this.taskData.id, task)
          .then(() => {
            this.resetForm();

            this.dialogRef.close();
          })
          .catch((error) => {
            console.error('Error updating task:', error);
          });
      } else {
        this.taskService
          .addTask(task)
          .then((ref) => {
            this.resetForm();
            this.dialogRef.close();
          })
          .catch((error) => {
            console.error('Error adding task:', error);
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  resetForm() {
    this.mode = 'NEW';
    this.header = 'Add Task';
    this.taskForm.reset();
    this.taskData = {};
  }

  edit(taskData: any) {
    this.taskData = taskData;
    if (this.taskData) {
      this.taskData = this.taskData;
      this.mode = 'EDIT';
      this.taskForm.patchValue({
        name: this.taskData.name,
        description: this.taskData.description,
        dueDate: new Date(this.taskData.dueDate),
      });
    }

    if (this.mode == 'EDIT') {
      this.header = 'Edit Task';
    }
  }
}
