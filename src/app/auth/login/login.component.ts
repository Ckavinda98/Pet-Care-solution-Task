import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ MatInputModule, MatFormFieldModule,MatCardModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  email: string = '';
  password: string = '';
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error logging out: ', error);
    });
  }

  onSubmit(): void {
    const loginForm = this.loginForm.getRawValue();
    this.email = loginForm.email;
    this.password = loginForm.password;
    console.log("login email", this.email);
  
    this.authService.signIn(this.email, this.password).subscribe(
      userCredential => {
        console.log('User signed in: ', userCredential);
  
        this.authService.getAuthToken().subscribe(
          token => {
            localStorage.setItem('authToken', token);
            console.log('Token saved in localStorage:', token);
  
            this.router.navigate(['/task-list']);
          },
          error => {
            console.error('Error getting auth token:', error);
          }
        );
      },
      error => {
        console.error('Error during sign-in:', error);
      }
    );
  }
  

}
