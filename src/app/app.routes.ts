import { Routes } from '@angular/router';
import { TasklistComponent } from '../components/task/tasklist/tasklist.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'task-list', component: TasklistComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
];
