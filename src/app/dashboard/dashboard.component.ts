import { Component } from '@angular/core';
import { Project } from '../../types/project.type';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private auth:AuthService, private router:Router){}
  showLogoutModal = false;

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  logout() {
    this.showLogoutModal = false;
    this.auth.setLoggedOut();
    this.router.navigate(['/login'])
  }
}
