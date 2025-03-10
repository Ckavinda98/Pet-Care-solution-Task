import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../task-service.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CrudTaskComponent } from '../crud-task/crud-task.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tasklist',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    CommonModule,
    MatDialogModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './tasklist.component.html',
  styleUrl: './tasklist.component.css',
})
export class TasklistComponent implements OnInit {
  displayedColumns: string[] = [
    'dragHandle',
    'name',
    'description',
    'status',
    'dueDate',
    'delete',
  ];
  dataSource: any[] = [];
  filterDataSource: any[] = [];

  task: any[] = [];
  data: any;
  selectedStatus!: string;
  forceCloseDialog: boolean = false;
  @ViewChild(CrudTaskComponent) crudTaskComponent!: CrudTaskComponent;
  constructor(
    private router: Router,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks() {
    this.taskService
      .getAllTasks()
      .snapshotChanges()
      .subscribe({
        next: (data) => {
          this.task = data
            .map((item) => {
              const taskData = item.payload.val();
              const id = item.key;
              const status = taskData.isTaskCompleted ? 'Completed' : 'Pending';
              return { id, status, ...taskData };
            })
            .filter((task) => task.isDeleted !== true);
          this.dataSource = this.task;
          this.filterDataSource = this.dataSource;
        },
        error: (err) => {
          console.error('Error retrieving tasks: ', err);
        },
      });
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(CrudTaskComponent);
  }

  onRowClick(taskId: string): void {
    this.forceCloseDialog = true;
    this.taskService
      .getAllTasks()
      .snapshotChanges()
      .subscribe({
        next: (data) => {
          const taskData = data
            .map((item) => {
              const task = item.payload.val();
              const id = item.key;
              const status = task.isTaskCompleted ? 'Completed' : 'Pending';
              return { id, status, ...task };
            })
            .find((task) => task.id === taskId);

          if (this.forceCloseDialog) {
            const dialogRef = this.dialog.open(CrudTaskComponent, {});

            dialogRef.afterOpened().subscribe(() => {
              const dialogComponent = dialogRef.componentInstance;
              dialogComponent.edit(taskData);
              this.forceCloseDialog = false;
            });
          } else {
            console.error('Task not found');
          }
        },
        error: (err) => {
          console.error('Error retrieving tasks: ', err);
        },
      });
  }

  deleteTask(taskId: string): void {
    const taskData = { isDeleted: true };

    this.taskService
      .updateTask(taskId, taskData)
      .then(() => {
        this.getAllTasks();
      })
      .catch((error) => {
        console.error('Error marking task as deleted:', error);
      });
  }

  statusUpdate(taskId: string): void {
    const taskData = { isTaskCompleted: true };

    this.taskService
      .updateTaskStatus(taskId, taskData)
      .then(() => {
        this.getAllTasks();
      })
      .catch((error) => {
        console.error('Error marking task mark as Completed:', error);
      });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
    this.dataSource = [...this.dataSource];
  }

  onChange(event: any): void {
    const selectedValue = event.value;

    if (selectedValue === '1') {
      this.dataSource = this.filterDataSource.filter(
        (task) => task.isTaskCompleted === true
      );
    } else if (selectedValue === '2') {
      this.dataSource = this.filterDataSource.filter(
        (task) => task.isTaskCompleted === false
      );
    } else {
      this.dataSource = [...this.filterDataSource];
    }
  }

  clearSelection() {
    this.selectedStatus = '';
    this.onChange({ value: null });
  }
}
