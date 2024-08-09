import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header>
      <nav>
        <!-- <a (click)="logout()" *ngIf="isLoggedIn">Logout</a> -->
      </nav>
    </header>

    <router-outlet></router-outlet>
  `,
  styles: [`
    /* Add your styles here */
  `]
})
export class AppComponent {
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}