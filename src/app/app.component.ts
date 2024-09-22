import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private cookieServ: CookieService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id',id);
    const userId = +this.cookieServ.get('userId');
    const email = this.cookieServ.get('email');
    
    if (userId && email) {
      this.authService.setUser({ userId, email, role: '' });
      this.authService.setLoggedIn();
    }
    
    this.authService.isLoggedIn.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        if (id) {
          this.router.navigate([`/dashboard/project/${id}`]);
        } else {
          this.router.navigate(['/dashboard/project']);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
