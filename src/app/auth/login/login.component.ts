import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  email: string = '';
  password: string = '';
  loginErrorMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.authService
      .signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {});
  }

  onSubmit(): void {
    const loginForm = this.loginForm.getRawValue();
    this.email = loginForm.email;
    this.password = loginForm.password;

    this.authService.signIn(this.email, this.password).subscribe(
      (userCredential) => {
        this.authService.getAuthToken().subscribe(
          (token) => {
            localStorage.setItem('authToken', token);

            this.router.navigate(['/task-list']);
          },
          (error) => {
            this.loginErrorMessage =
              'Error getting auth token, please try again.';
          }
        );
      },
      (error) => {
        if (error.status === 401) {
          this.loginErrorMessage = 'Invalid credentials. Please try again.';
        } else if (error.status === 400) {
          this.loginErrorMessage = 'Invalid credentials. Please try again.';
        } else {
          this.loginErrorMessage = 'Invalid credentials. Please try again.';
        }
      }
    );
  }
}
