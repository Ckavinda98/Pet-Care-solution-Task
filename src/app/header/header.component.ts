import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private authService: AuthService,
     private router: Router
  ) { }

  logout() {
    this.authService.signOut().then(() => {
      console.log('User successfully logged out');
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error logging out: ', error);
    });
  }
}
