import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private dbPath = '/task';
  taskRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) {
    this.taskRef = db.list(this.dbPath);
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getHttpHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  addTask(task: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const pushResult = this.taskRef.push(task);
      pushResult.then((ref) => resolve(ref)).catch((error) => reject(error));
    });
  }

  updateTask(key: string, task: any): Promise<void> {
    return this.taskRef.update(key, task);
  }

  deleteTask(key: string, task: any): Promise<void> {
    return this.taskRef.update(key, task);
  }

  updateTaskStatus(key: string, task: any): Promise<void> {
    return this.taskRef.update(key, task);
  }

  getAllTasks() {
    return this.taskRef;
  }

  getTaskById(taskId: string): any {
    return this.db.object(`/tasks/${taskId}`).snapshotChanges();
  }
}
