import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiResponse, User } from '../../types/response.type';
import { ToastService } from '../Services/toast.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username!: string;
  password!: string;
  errorMessage: string = '';
  isLoading: boolean = false;  // Add this line to manage loading state

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService, private cookieService: CookieService) {}

  login() {
    this.isLoading = true;  // Set loading to true when login starts
    if (!this.username || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      this.isLoading = false;  // Reset loading state
      return;
    }
    this.authService.login(this.username, this.password).subscribe({
      next: (response: ApiResponse<'user', User>) => {
        this.isLoading = false;  // Reset loading state on successful response
        if (response && response.status === 'success') {
          this.cookieService.set('email', response.user?.email??'')
          this.cookieService.set('userId', response.user?.userId.toString()??'')
          this.authService.setLoggedIn();
          this.toastService.showSuccess(response.message, response.status);
          this.router.navigate(['/dashboard/project']);
        } else {
          this.errorMessage = 'Invalid username or password';
          this.toastService.showError(response.message, response.status);
        }
      },
      error: (error) => {
        this.isLoading = false;  // Reset loading state on error
        console.error('Login error', error);
        this.errorMessage = 'Invalid username or password';
        this.toastService.showError('Something went wrong', 'Error');
      }
    });
  }
}
